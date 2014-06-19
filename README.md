moonlight-skulk
===============

moonlight-skulk is the temporary name of my #indie3jam entry : a JRPG style adventure game with a stealth mechanic

Development notes
======

This stuff is just for me to keep track, since I'm afraid using GitHub's issue tracker or Wiki would bloat my process, and since I only have 4 days, I can't afford that.

## TODO : AI should wander around the map

The AI should, in their default states, wander around the map aimlessly. They should restrict themselves to normal pedestrian traffic lanes, which will likely require the marking of such lanes in TilED.

## TODO : "Run away" AI reports you to "Chase" AI types

The "Run Away" AI type should continue running away until it finds a "Chase" AI type to report you to, or until a certain amount of time has passed since the last time they saw you

## TODO : "Chase" AI should actively "look" for you after it loses you, for a certain amount of time

See above, once the Chase AI loses you, it should look for you for some time before giving up

## TODO : Player should be able to "steal" from people

The player should be able to get within a certain distance of people, press an action button, and "steal" objects from them

## TODO : Player should be able to pick locks

It feels more thiefy if the player can pick locks. Maybe incorporate some kind of gesture library to let them jiggle the mouse/wiggle their fingers on the touchscreen to "pick" a lock. This also requires making a distinction between open portals, locked doors, and unlocked doors on the map.

## TODO : If a player is caught by a Chase AI, then the game is over

There is no combat in this game; if you are caught, that's it, game over.

## TODO : Keep score for the player

The game should keep score based on how much loot the player steals ($$ value?), how many times they have been seen, and how many times they have escaped. The goal of the game is twofold: To play the longest without getting caught, and to have the highest score when you are caught.

## TODO : AI stops and chats with each other

A coup de grace would be if, every so often, AI would randomly stop and have short preprogrammed chats with each other.
