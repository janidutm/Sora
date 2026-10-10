const test=require('node:test'),assert=require('node:assert/strict');
const {username,initial}=require('../profile.js');
const {createBackup,parseBackup,restoreLibrary}=require('../backup.cjs');
test('usernames support Unicode, trim whitespace, and reject empty or unsafe values',()=>{
 assert.equal(username('  Janidu   TM  '),'Janidu TM');assert.equal(initial('janidutm'),'J');
 assert.equal(username('べる'),'べる');assert.equal(initial('べる'),'べ');assert.equal(initial(null),'?');
 for(const value of ['',null,{},' '.repeat(5),'a'.repeat(33),'name\u0000','name\u202e'])assert.equal(username(value),'');
});
test('username survives backup and restore while old backups remain compatible',()=>{
 const library=name=>({watchlist:[],history:[],preferences:{username:name}});
 const backup=parseBackup(JSON.parse(JSON.stringify(createBackup(library('Janidu')))));
 assert.equal(backup.preferences.username,'Janidu');
 assert.equal(restoreLibrary(library('Old'),backup,'merge').preferences.username,'Janidu');
 assert.equal(restoreLibrary(library('Old'),library(undefined),'merge').preferences.username,'Old');
 assert.equal(parseBackup(createBackup(library(undefined))).preferences.username,undefined);
});
