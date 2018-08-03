;(function ($) {
  var OSMapField;

  /*
    Field
  */

  OSMapField = function (field) {
    // State
    this.is_active = false;

    // Field Components
    this.field = $(field);
    this.container = this.field.parents('.field-osmap');
    this.location_fields = {
      address: this.container.find('.input-address'),
      lat: this.container.find('.osmap-lat'),
      lng: this.container.find('.osmap-lng'),
      zoom: this.container.find('.osmap-zoom')
    };

    // OS Maps Interface
    this.osmap_canvas = this.container.find('.field-osmap-ui');
    this.settings = {
      osmap: {
        center: {
          lat: parseFloat(this.location_fields.lat.val() || this.osmap_canvas.data('lat')),
          lng: parseFloat(this.location_fields.lng.val() || this.osmap_canvas.data('lng'))
        },
        zoom: parseInt(this.location_fields.zoom.val()) || this.osmap_canvas.data('zoom') || 6,
        disableDefaultUI: true,
        scrollWheelZoom: false,
        zoomControl: true,
        zoomControlOptions: {
          position: 0
        }
      }
    };

    this.init();
  };

  OSMapField.prototype.init = function () {
    this.osmap = new L.Map(this.osmap_canvas.get(0), this.settings.osmap);
    L.tileLayer( 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      subdomains: ['a','b','c']
    }).addTo( this.osmap );

    this.pinDefault = L.divIcon({className: 'icon fa fa-map-marker'});

    this.pin = new L.Marker([this.settings.osmap.center.lat, this.settings.osmap.center.lng],
      {draggable: true, icon: this.pinDefault}
    ).addTo( this.osmap );

    $('.leaflet-marker-icon').css('font-size', '40px').css('margin-top', '-40px').css('margin-left', '-11.42px');

    this.listen();
  };

  OSMapField.prototype.listen = function () {
    // Address Input
    this.location_fields.address.on('keydown', (function (_osmap) {
      return function (e) {
        
        if (e.keyCode == 13) {
          e.preventDefault();
          e.stopPropagation();
          _osmap.geocode();
        }
      }
    })(this));

    this.container.find('.locate-button').on('click', (function (_osmap) {

      return function (e) {
        _osmap.geocode();
      }
    })(this));

    L.DomEvent.addListener(this.pin, 'dragend', (function(_osmap) {
      return function (e) {
        _osmap.geocode_result = _osmap.pin.getLatLng();
        _osmap.update_position();
      }
    })(this));
     L.DomEvent.addListener(this.osmap, 'zoomend', (function (_osmap) {
      return function (e) {
        _osmap.update_position();
      }
    })(this));

  };

  OSMapField.prototype.geocode = function () {
    _osmap = this;
    $.getJSON('https://nominatim.openstreetmap.org/search?format=json&limit=1&q=' + this.location_fields.address.val(), function(data) {
      if (data.length > 0) {
        $.each(data, function(key, val) {
          _osmap.update_position(L.latLng(val.lat, val.lon));
        });
      } else {
        alert('Sorry, the location couldn’t be found.');
      }
    });
  };

  OSMapField.prototype.update_position = function (to) {
    if (!to) to = this.pin.getLatLng();

    this.location_fields.lat.val(to.lat);
    this.location_fields.lng.val(to.lng);
    this.location_fields.zoom.val(this.osmap.getZoom());
    this.pin.setLatLng(to);
    this.osmap.panTo(to);
  };

  $.fn.osmapField = function () {
     new OSMapField(this);
  };

})(jQuery);
