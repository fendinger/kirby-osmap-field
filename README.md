# Kirby OpenStreetMap Field

This custom field for [Kirby CMS](https://getkirby.com) displays an OpenStreetMap inside the panel (Kirby's backend) to Locate a place and get its geocoordinates.

Based on the [Kirby Map Field] from [August Miller](https://github.com/AugustMiller/kirby-map-field).

[Leftlet](https://leafletjs.com) JavaScript library from [Vladimir Agafonkin](http://agafonkin.com/en).

In times of the GPDR it may be important to replace a Google Maps Plugin with a GDPR compliant one.

## Features

- Familiar OpenStreetMaps UI
- Discrete storage of location name, latitude and longitude
- Geocoding of location names and addresses
- Repositionable marker (in case search doesn't nail it)
- Support for multiple `map` fields per form
- Support for `map` fields within `structure` fields
- Support for `map` fields in file forms
- Easy to implement (See "Getting Started", below)
- Customizable initial position and zoom— globally and on a per-field basis
- Compatible with Kirby 2.3.0+

![Kirby OpenStreetMap Field Screenshot](https://github.com/fendinger/kirby-osmap-field/raw/master/kirby-osmap-field.png)

### Blueprint example
```yml
fields:
  location:
    label: Location
    type: map
    center:
      lat: 48.3985233
      lng: 9.9925550
      zoom: 9
    help: >
    
```

The `center` key allows you to customize the initial position and zoom level of the map interface.

You can also set global defaults, in your `config.php`:

```php
c::set('osmap.defaults.lat', 45.5230622);
c::set('osmap.defaults.lng', -122.6764816);
c::set('osmap.defaults.zoom', 9);
```

These options will be overridden by any set on individual fields. Without either configured, it will default to hard-coded values.

## Template Usage

The OpenStreetMap Field stores data in YAML.

You must manually transform the field to an associative array by calling the [`yaml` field method](https://getkirby.com/docs/cheatsheet/field-methods/yaml).

The resulting array can be used just like any other:

```php
$page->location()->yaml()['lat'];
// Or!
$location = $page->location()->yaml();
echo $location['lng']; # => -122.6764816
```

Properties `address`, `lat` and `lng` should exist in the decoded object, but may be empty.

Kirby creator Bastian Allgeier recently created the [Geo Plugin](https://github.com/getkirby-plugins/geo-plugin), which is a great toolkit for working with coordinates. Check it out!

## Setup

``git clone https://github.com/JensFendinger/kirby-osmap.git site/fields/osmap``
From the root of your kirby install.

Alternatively you can download the zip file, unzip it's contents into site/fields/osmap.
