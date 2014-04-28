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
var pointdns = require('pointdns')({ username: 'john@example.com', apitoken: 'secret-key' })

```

### Create a new zone
```javascript
pointdns.zone.add(function( err, zone ){
  console.log('pointdns.zone.add', zone, err )
}, {'name': 'example.com'})
```

### Get list of zones
```javascript
pointdns.zones.list(function( err, zones ){
  console.log('pointdns.zones.list', zones, err )
})
```

### Get list of zones by group
```javascript
pointdns.zones.list(function( err, zones ){
  console.log('pointdns.zones.list group Clients', zones, err )
}, {group:'Clients'})
```

### Update a zone
```javascript
pointdns.zone.update(function( err, zone ){
  console.log('pointdns.zone.update', zone, err )
    }, {zone_id: 1}, {'group':'Services'})
```

### Get zone
```javascript
pointdns.zone.get(function( err, zone ){
  console.log('pointdns.zone.get', zone, err )
}, {zone_id: 1})
```

### Delete zone
```javascript
pointdns.zone.del(function( err, zone ){
  console.log('pointdns.zone.del', zone, err )
}, {zone_id: 1})
```

### Create a new record
```javascript
pointdns.record.add(function( err, record ){
  console.log('pointdns.record.add', record, err )
}, {'zone_id': 1}, {"name":"site","record_type":"A","data":"1.2.3.4"})
```

### Update a record
```javascript
pointdns.record.update(function( err, record ){
  console.log('pointdns.record.update', record, err )
}, {'zone_id': 1, 'record_id': 1}, {"name":"site2","data":"2.3.4.5"})
```

### Get list of records for zone
```javascript
pointdns.records.list(function( err, records ){
  console.log('pointdns.records.list', records, err )
}, {zone_id: 1})
```

### Get record for zone
```javascript
pointdns.record.get(function( err, record ){
  console.log('pointdns.record.get', record, err )
}, {'zone_id': 1, 'record_id': 1})
```

### Delete a record
```javascript
pointdns.record.del(function( err, records ){
  console.log('pointdns.record.del', records, err )
}, {'zone_id': 1, 'record_id': 1})
```
