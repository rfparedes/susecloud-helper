function capitalize(str){
    return (str === null || str.length === 0) ? str : str[0].toUpperCase() + str.slice(1);
  }

  

$(document).ready(() => {

    $('#step1').hide();

    const pint = 'https://susepubliccloudinfo.suse.com/v1/';

    /** Populate the provider dropdown with the CSP's */
    providerDropdown = $('#provider-dropdown');
    providerDropdown.empty();
    providerDropdown.append('<option selected="true" disabled>Choose Provider</option>');
    providerDropdown.prop('selectedIndex', 0);

    pintProvider = pint + 'providers.json'

    $.getJSON(pintProvider, (providerData) => {
      $.each(providerData.providers, function (index, provider) {
        providerDropdown.append($('<option></option>').attr('value', provider.name).text(capitalize(provider.name)));
      });
    });
    
      /** Populate the region dropdown with the CSP regions */
    regionDropdown = $('#region-dropdown');
    regionServerContent = $('#region-servers');
    regionDropdown.empty();
    regionServerContent.empty();
    regionDropdown.append('<option selected="true" disabled>Choose Region</option>');

    rmtServerContent = $('#rmt-servers');


    $('#provider-dropdown').change(function() {
        regionDropdown.empty();
        regionServerContent.empty();
        $('#button-1').removeClass('active');
        $('#button-2').removeClass('active');
        $('#button-3').removeClass('active');

        provider = $('#provider-dropdown').val();

        pintRegion = pint + provider + '/regions.json'
        pintRegionServers = pint + provider + '/servers/regionserver.json'

        $.getJSON(pintRegion, function (regionData) {
          $.each(regionData.regions, function (index, region) {
            regionDropdown.append($('<option></option>').attr('value', region.name).text(region.name));
          });
        });

        $('#step1').show();
        $('#button-1').addClass('active');

        $.getJSON(pintRegionServers, function (regionServerData) {
          $.each(regionServerData.servers, function(index, regionServer) {
            regionServerContent.append($('<div></div>').attr('value', regionServer.ip).text(regionServer.ip));
          });
        });
      });

    $('#button-2').on('click', () => {
      rmtServerContent.empty();
      $('#step1').hide();
      $('#button-1').removeClass('active');
      $('#button-2').addClass('active');
      $('#step2').show()
      pintRMTServers = pint + provider + '/servers/smt.json'
      currentRegion = $('#region-dropdown').val();
      $.getJSON(pintRMTServers, function (rmtServerData) {
        $.each(rmtServerData.servers, function(index, rmtServer) {
          if (rmtServer.region == currentRegion) {
            rmtServerContent.append($('<div></div>').attr('value', rmtServer.ip).text(rmtServer.ip));
          }
        });
      });

    });

});

  /**
  * load servers from the public cloud service, leveraging the type,
  * and the currently selected csp
  *
  * example urls: https://susepubliccloudinfo.suse.com/v1/oracle/servers/smt.xml
  *               https://susepubliccloudinfo.suse.com/v1/amazon/servers/regionserver.xml
  */


