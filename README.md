# Directus Filter Panel
An extension to Directus which provides a panel to apply filtering upon all surrounding panels within the same dashboard.

## How Does it Work?

The filter panel provides us with a form which changes the _filter_ option of the panels within the same dashboard, i.e.

https://user-images.githubusercontent.com/5946359/164047494-359e337f-be98-4998-a5f2-c34b1ad478d2.mp4

This is achieved by looking up the relevant panels and changing the database if those panels contain a filter which matches the collection and the field provided by the filter panel.

## How to Use

To add this panel to your own Directus instance, you should be able to download the artifact from the release, and copy the `index.js` inside the `extensions/panels/filter` directory, as is suggested by the [documentation](https://docs.directus.io/extensions/creating-extensions/).
