#CMD++
#####An incremental game formed around a console.
Welcome to CMD++. This game is still in extremely early development, so if anything is not perfect, or features are missing, be patient, or add them yourself by contributing! If you have any ideas, questions, bugs, suggestions, etc. post them in the [CMD++ Subreddit](https://www.reddit.com/r/cmdplusplus). The only way this will get better is with your feedback and contributions!

[![Reddit](https://upload.wikimedia.org/wikipedia/en/b/b4/Reddit_logo.svg)](https://www.reddit.com/r/CMDPlusPlus/)
[![Gitter](https://badges.gitter.im/cmdPP/core.svg)](https://gitter.im/cmdPP/core?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

####Attention:
If your save does not work after an update, try [clearing your local storage on your browser](http://www.ghacks.net/2015/02/05/how-to-clear-web-storage-in-your-browser-of-choice/). I'll try my best to make sure this does not happen though. This also applies if a command says that it is not unlocked.

###Developers read this
There is a new subreddit for developers.  
I will add a post on /r/CMDPlusPlus where you can post a comment if you're a contributer.
Then I will add you to the list of people allowed to post on /r/CMDPPDevelopers

#####Todo:
- Add upgrades
- Add virus and antivirus
- Add upgrades, both those bought with data or money
- Add a `dataStream` command that is more funny than useful. Example: [Name] likes [noun]: Jeremy likes shwarma. This would be so the user can "sample" their data.
- Overhaul javascript to make it easier to maintain commands and upgrades (will work on it this weekend Crownie88)
- You can add more todos, or as a more informal way, add to [this doc](http://htwins.net/edit/cmdplusplus)

#####Version History

######V0.6
- Reworked the files to make them easier to develop on
- Reworked the themes to make them much more usefull
- Simplified the `save` and `load` system

######V0.5
- Added `colorScheme`
- Fixed typed commands not showing

######V0.4
- Added a `clear` function
- Cleaned up some code
- Added `upgradeMine` for `mineData`
- Minor changes and bug fixes
- Added autocomplete by `tab`
- Console now displays typed commands

######V0.3
- Added storage sizes
- New commands: `upgradeStorage`, `currentStorage` and added `help [function]` for both
- Added version number
- Added the functions `CMD.formatLargeData()` and `CMD.nFormat()`
- Prices may need balancing

######V0.2
- Added `save` and `load`
- Fixed history buffer to not do repeat commands (thanks /u/crownie88)
- The game now autosaves every 10 seconds
- Fixed the money count not showing up in the top left

######V0.1
- Added `buyCommand` function
- Added `help` function with specific command help
- Added data sizes of byte->kb->mb etc
- Added `buyData` and `sellData`
- Removed the auto unlocking of commands



