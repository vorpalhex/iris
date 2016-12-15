"use strict";
const bus = require(__dirname + '/../core/bus');

const badhorseLyrics = `>>>
_Bad Horse_
_Bad Horse_
_Bad Horse_

He rides across the nation
The thoroughbred of sin
He got the application
That you just sent in

It needs evaluation
So let the games begin
A heinous crime, a show of force
A murder would be nice of course

_Bad Horse_
_Bad Horse_
_Bad Horse_
_He’s Bad_

The Evil League of Evil
Is watching so beware
The grade that you receive
Will be your last we swear

So make the Bad Horse gleeful
Or he’ll make you his mare...

You’re saddled up
There’s no recourse
It’s Hi-Ho Silver
Signed, *Bad Horse*
`;

module.exports = {
  register: ()=>{
    bus.subscribe('message.direct', (eName, message) => {
        if (message.contents.toLowerCase() === 'badhorse') message.respond(badhorseLyrics);
    });
  },
  help: ()=>{
    return {
      cmd: 'badhorse',
      description: 'print out the badhorse chorus',
      aliases: []
    };
  }
}
