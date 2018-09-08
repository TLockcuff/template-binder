# Introduction
Template Binder is a javascript tool that takes data and binds it to a template. It's similar to handlebars or Shopify's DotLiquid syntax. This is a very small and basic templating engine. Comes with built in support for custom plugins.

## Features
- Written in ES5 
- Built-in plugin architecture
- Small and very fast

# Example
## HTML Template Example:
```html
<div id="placeholder">
    <!-- Template Renders Here -->
</div>

<script type="text/html" id="template">
    <div class="col-4">
        <div class="card mb-3">
            <img class="card-img-top" src="{Image}">
            <div class="card-body">
                <h4 class="card-title">{ Title }</h4>
                <p class="card-text">{ Text }</p>
                <small class="text-muted">{ Date | moment:'MMMM DD, YYYY' }</small>
            </div>
        </div>
    </div>
</script>
```
## JavaScript Example: 
```js
// Example Data
var data = [{
  Image: 'https://source.unsplash.com/daily',
  Title: 'Example Title',
  Text: 'This is sample text for the card',
  Date: new Date('09/10/2018')
}];

// Bind data to the template and set the placeholder
var html = mc.template.run($('#template'), [data]);
$('#placeholder').html(html);
```

## Plugin Example
```js
// this plugin requires moment.js
mc.template.addPlugin('moment', function (value, pattern) { return moment(value).format(pattern); });
```