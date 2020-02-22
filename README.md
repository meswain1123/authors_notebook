
### Author's Notebook 

This is an app that I've been wanting to build for a while.  It's purpose is to provide a place for keeping track of various world building plans.  I would like to make it so it's publicly available, and that any authors (aspiring and published) can use it to help them organize their stories.  I want to make it automate a number of things, but the biggest part is to make it very dynamic and to allow for storage of all different kinds of notes.  

It will allow you to define Types, with various Attributes of different kinds, which can then be used to store Things, which have values for those Attributes.  

I would allow for all kinds of inheritance.  Types could be defined as having Super Types, and would automatically inherit their Attributes.  I will also allow for Types which set Defaults for some of their Attributes.  I will also allow multiple inheritance, so long as there is no Attribute or Default Clashes.  Attribute Clashes are when there are Attributes with the same Name, but different types.  Default Clashes are when there are Defaults for the same Attribute Name, but different values.

Things could be defined with no Type at all, or multiple Types.  If there are multiple Types then it will again require that there are no Attribute or Default Clashes, but otherwise it will make it a lot faster and more logical when defining a Thing.

I'm using such generic terms because I want the system to be able to handle anything from a territory of land, to specific characters, diseases, spells, potions, weapons, poems, songs, and magic systems of all kinds from the scientific to the esoteric.  It needs to handle kingdoms, government structures, ranks, titles, school schedules, and favorite foods, as well as interpersonal relationships like boyfriend/girlfriend, spouses, parent/child, friend, acquaintence, boss/employee, master/slave, and owner/pet.  It can all fit into this structure.

I also plan to make it so everything is kept as secure as possible.  Owners of worlds and their collaborators will be the only ones who are able to see the data about a world (even it's name and existence) unless the owner chooses to make it public.  I would also encrypt all data in the db with a key that the owner and their collaborators would have, but even I wouldn't have it stored anywhere.  Every time they logged in they would have to enter it, and it would be stored in their session.

### Building and Running

This uses two docker images, one for the client and one for the server.  The easiest way for me to run it is to have two terminals open to their directories and running 

`npm start`

in server and then in client.

### Current bugs

