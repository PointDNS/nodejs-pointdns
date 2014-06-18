nodejs-pointdns
===============

This library provides easy access to point zone & record management. For information about the services offered on Point see [the website](http://pointhq.com)

## Authentication

To access your Point account, you'll need to define your username & apitoken. The username is your email address and the apitoken is the API token which, can be found in My Account tab.

## Instalation

NPM latest stable version:
```
npm install pointdns
```
or NPM most recent version:
```
npm install git+https://github.com/copper/nodejs-pointdns.git
```

## Example

### Load module
```javascript
var pointdns = require('pointdns')({ username:'john@example.com', apitoken:'secret-key' })

```

### Create a new zone
```javascript
pointdns.zone.add({'name': 'example.com'},
    function( err, zone ){
        console.log('pointdns.zone.add', zone, err )
    }
)
```

### Get list of zones
```javascript
pointdns.zones.list({},
    function( err, zones ){
        console.log('pointdns.zones.list', zones, err )
    }
)
```

### Get list of zones by group
```javascript
pointdns.zones.list({group:'Clients'},
    function( err, zones ){
        console.log('pointdns.zones.list group Clients', zones, err )
    }
)
```

### Update a zone
```javascript
pointdns.zone.update({zone_id: 1}, {'group':'Services'},
    function( err, zone ){
        console.log('pointdns.zone.update', zone, err )
    }
)
```

### Get zone
```javascript
pointdns.zone.get({zone_id: 1},
    function( err, zone ){
        console.log('pointdns.zone.get', zone, err )
    }
)
```

### Delete zone
```javascript
pointdns.zone.del({zone_id: 1},
    function( err, zone ){
        console.log('pointdns.zone.del', zone, err )
    }
)
```

### Create a new record
```javascript
pointdns.record.add({'zone_id': 1}, {"name":"site","record_type":"A","data":"1.2.3.4"},
    function( err, record ){
        console.log('pointdns.record.add', record, err )
    }
)
```

### Update a record
```javascript
pointdns.record.update({'zone_id': 1, 'record_id': 1}, {"name":"site2","data":"2.3.4.5"},
    function( err, record ){
        console.log('pointdns.record.update', record, err )
    }
)
```

### Get list of records for zone
```javascript
pointdns.records.list({zone_id: 1},
    function( err, records ){
        console.log('pointdns.records.list', records, err )
    }
)
```

### Get record for zone
```javascript
pointdns.record.get({'zone_id': 1, 'record_id': 1},
    function( err, record ){
        console.log('pointdns.record.get', record, err )
    }
)
```

### Delete a record
```javascript
pointdns.record.del({'zone_id': 1, 'record_id': 1},
    function( err, records ){
        console.log('pointdns.record.del', records, err )
    }
)
```
