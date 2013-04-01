require 'fileutils'

def jekyll(opts="", path="")
  # Remove existing site
  sh "rm -rf _site"
  # Kick off jekyll build
  sh path + "jekyll " + opts
end

def create_pjax_versions
  # Duplicates existing posts and substitues their layout to generate PJAX-frieldy version

  # Create snippets directory if it doesn't already exist
  Dir.mkdir("snippets") unless Dir.exists?("snippets")

  posts = Dir.glob('_posts/*/*.mdown')
  # Loop through the posts folder
  posts.each_with_index{ | file, index |
    # puts file

    # Split the post path up into year and name componenets.
    year = year_from_post_path(file)
    name = name_from_post_path(file)

    # Split off the date so we can stick it in the YAML frontmatter to access it from the layout
    date = date_from_post_name(name)

    # Make a directory for this post's year if it doesn't exist.
    Dir.mkdir("snippets/#{year}") unless Dir.exists?("snippets/#{year}")

    # Copy the file to the snippets folder
    FileUtils.cp(file, "snippets/#{year}/#{name}")

    # Get the next and previous posts, if they exist, to insert in the YAML frontmatter
    previous_post = index == 0 ? false : posts[index - 1]
    next_post = posts[index + 1]

    # Because the next and previous here are the original markdown posts, we run
    # generated_path_from_post_path to convert the URL into to the path for the generated
    # html
    if previous_post
      previous_post = generated_path_from_post_path(previous_post)
    end

    if next_post
      next_post = generated_path_from_post_path(next_post)
    else
      next_post = false
    end

    # Pass the new file into substitute_layout
    pjaxify_snippet_post("snippets/#{year}/#{name}", {
      :date => date,
      :next => next_post,
      :previous => previous_post
    })
  }
end

def date_from_post_name(name)
  name.split('-').slice(0..2).join('-')
end

def year_from_post_path(path)
  if path
    return path.match(/\d{4}/)
  end
end

def name_from_post_path(path)
  path.split('/')[2]
end

def generated_path_from_post_path(path)
  year = year_from_post_path(path)
  title_with_date = name_from_post_path(path)
  trimmed_title = title_with_date.split('-').slice(3..-1).join('-')
  title = trimmed_title.gsub(/.mdown/, "")
  return "/#{year}/#{title}"
end


def pjaxify_snippet_post(file, opts)
  # Open up the file and replace the layout with the pjax layout
  text = File.read(file)

  # Stick the new layout in and add the post date to the YAML front matter
  new_text = text.gsub(
    /layout: [a-zA-Z0-9]*/,
    "layout: pjax\ndate: #{opts[:date]}\nnext: #{opts[:next]}\nprevious: #{opts[:previous]}")
  File.open(file, "w") {|file| file.write(new_text) }
end

def rename_pjax_versions
  # Renames the pjax versions of the posts so that they can easily be targted with RewriteRule
  # This takes place after the build so that when Jekyll builds the site, the processed post attributes (such as date)
  # are kept in tact
  Dir.glob('_site/snippets/*/*.html') do |file|
    # puts file

    year = year_from_post_path(file)
    name_with_date = file.split('/')[3]
    trimmed_name = name_with_date.split('-').slice(3..-1).join('-')


    old_name = "_site/snippets/#{year}/#{name_with_date}"
    new_name = "_site/snippets/#{year}/#{trimmed_name}"
    # puts "New name is " + new_name
    # puts "Old name was " + old_name
    File.rename(old_name, new_name)
  end

end

desc "Build site using Jekyll"
task :build do
  create_pjax_versions # Create the pjax layout duplicates of all posts
  jekyll # Build the site
  rename_pjax_versions # Rename the generated posts
end

desc "Serve on Localhost with port 4000"
task :default do
  jekyll "--server --auto"
end

desc "Serve on Localhost with port 4000 using development version"
task :unstable do
  jekyll "--server --auto", "../jekyll/bin/"
end


namespace :deploy do

  desc "Deploy to Live"
  task :live => :build do
    rsync "example.com"
  end

  def rsync(domain)
    sh "rsync -rtz --delete _site/ username@example.com:~/#{domain}/"
  end
end
