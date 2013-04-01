# Pjaxyll

Runs on [Jekyll](https://github.com/mojombo/jekyll)

Sped up by [pjax](https://github.com/defunkt/jquery-pjax)

Deployed with rake/rsync


## How it works:

[Jekyll](https://github.com/mojombo/jekyll) is a small static site generator written in ruby.

A [rakefile](https://github.com/jakelear/pjaxyll/blob/master/Rakefile) to build and deploy the site.
Rake also takes care of the following:
* Duplicate each post and replace the layout with a pjax specific layout.
* Add the post date of the YAML front matter of the PJAX version to retain the post date
* Compile the jekyll site
