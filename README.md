## Description
This is a rather simplistic, Flask and React based app for planning reviews of learned material with increasing, inter-reviews interval (the so-called "spaced repetitions" effect). It was actually made from an individual need, not as any kind of portfolio project.  
The app is similar to (an ordinary) task-list divided into three columns:
* Due reviews - reviews that are due or scheduled for a given day
* Upcoming reviews
* Inactive reviews
After adding a task, it can be:
* Updated (title, description)
* Reset (data on previous repetitions is removed and a new review date is set)
* Moved into inactive tab (so that it won't appear as "due" or "upcoming")  
Before developing the app, I was using the following strategy:
1. Set up an event in Google Calendar (for instance "Read notes on Python in ...")
2. Configured it as a recurring event ("recur every ... days/weeks)
3. Efter each review, I had to manually multiply the interval by a given multiplier.  
That solution was cumbersome and prone to mistakes, so I took the opportunity to practice React and creating Rest API at the same time. The result is rather very imperfect (at best) and unfit to become a real web application - this was my first attempt at both: using React and REST API. But it does it's job right.
## How do I use it?
The React part of the application is served statically from the Flask development server ;) Which I run manually from the Linux virtual terminal.  
Check the "images" directory for screenshots.
