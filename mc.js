var mc = {};

/*********************************************************************************************
* Template Binder
* Returns an html string by binding data to a template with built in plugins and iterators
*
* Example (Basic):      mc.template.run($('#template'), [data...]);
* Example (Advanced):   mc.template.run($('#template'), [data...], function(key, value) { return value; });
*
* Run Params:
* @param {string|jQuery} template the html template.
* @param {array|object} data the data you wish to bind to the template
* @param {function} irerator a callback function that returns a key and value of each iteration
*
* Plugins
* You can add custom plugins to modify data before it renders to the template.
*
* Example:      mc.template.addPlugin('moment', function(value, pattern) { return moment(value).format(pattern); })
* Description:  Adds a plugin with moment to format dates
* @param {string}   pipe the name of the pipe: { Date | PIPE_NAME <-- }
* @param {function} fn the callback function to preform the modifications. Returns the following:
        @param {any} value the data value { Date <-- | PIPE_NAME }
        @param {any} pattern the item after the ":" of the pipe: { Date | PIPE_NAME:PATTERN <-- }
*********************************************************************************************/
mc.template = {
    plugins: {},
    plugins: function () { return Object.keys(this.plugins) },
    addPlugin: function (pipe, fn) { this.plugins[pipe] = { pipe: pipe, fn: fn }; },
    run: function (template, data, iterator) {
        // saftey checks
        if (!template && !data) { console.warn('mc.template', 'missing template and data'); return false; }
        if (!template) { console.warn('mc.template', 'missing a template string or jquery selector'); return false; }
        if (!data) { console.warn('mc.template:', 'missing data'); return false; }

        // handle to data and the return value
        var oRetVal = '';
        var aList = (Array.isArray(data)) ? data : [data];

        // adds support for jquery selector or string
        template = (typeof (template) != 'string') ? $(template).html() : template;

        // bind data to the template
        // includes, plugins, iterators and template replacements
        aList.forEach(function (o) {
            var tempTemplate = template;
            tempTemplate.match(/{([^}]+)}/g).forEach(function (p) {
                var placeholder = p.replace(/{/g, '').replace(/}/g, '').trim();
                var value = o[placeholder];
                if (!value) value = '';
                var oPipe = mc.template._parsePipe(placeholder);
                if (oPipe && o[oPipe.name] && mc.template.plugins[oPipe.pipe]) { value = mc.template.plugins[oPipe.pipe].fn(o[oPipe.name], oPipe.pattern); }
                value = (iterator) ? iterator(placeholder, value) : value;
                tempTemplate = tempTemplate.replace(p, value);
            });
            oRetVal += tempTemplate;
        });

        // return the html back
        return oRetVal;
    },
    _parsePipe: function (placeholder) {
        // helper function to parse pipes back to a usable form
        var oPipe = null;
        if (!placeholder || (typeof (placeholder) != 'string')) return null;
        if (placeholder.indexOf('|') > -1) {
            oPipe = {};
            oPipe.name = placeholder.split('|')[0].trim();
            oPipe.pipe = placeholder.split('|')[1].trim();
            if (placeholder.split('|')[1].indexOf(':') > -1) {
                var pipeParts = placeholder.split('|')[1].split(':');
                oPipe.pipe = pipeParts[0].trim();
                oPipe.pattern = pipeParts[1].trim().replace(/'/g, '');
            }
        }
        return oPipe;
    }
}
// Avaiable Template Plugins
mc.template.addPlugin('debug', function (value, pattern) { console.log('value: ' + value, '\npattern: ' + pattern); return value; });
mc.template.addPlugin('moment', function (value, pattern) { return moment(value).format(pattern); });
mc.template.addPlugin('uppercase', function (value, pattern) { return typeof value === 'string' ? value.toUpperCase() : value; });
mc.template.addPlugin('lowercase', function (value, pattern) { return typeof value === 'string' ? value.toLowerCase() : value; });
mc.template.addPlugin('capitalize', function (value, pattern) { return typeof value === 'string' ? value.charAt(0).toUpperCase() + value.slice(1) : value; });
mc.template.addPlugin('truncate', function (value, pattern) { return typeof value == 'string' ? value.length <= pattern ? value : value.slice(0, pattern) + '...' : value; });
mc.template.addPlugin('truncateWords', function (value, pattern) { return typeof value == 'string' ? Number(pattern) < value.split(/[ \t]/).length ? value.split(/[ \t]/).slice(0, Number(pattern)).join(' ').trim() + '...' : value : value; });
mc.template.addPlugin('trim', function (value, pattern) { return typeof value == 'string' ? value.trim() : value; });
mc.template.addPlugin('join', function (value, pattern) { return Array.isArray(value) ? value.join(', ').trim() : value; });
