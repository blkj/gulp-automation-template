require 'compass/import-once/activate'
# Require any additional compass plugins here.

# Set this to the root of your project when deployed:
http_path = "/"
css_dir = "static/css"
sass_dir = "static/sass"
images_dir = "static/image"
javascripts_dir = "static/js"

# 禁用缓存
cache = false

# 开启sourcemap，更方便调试
sourcemap = true

# 输出格式，可选择 :expanded or :nested or :compact or :compressed
output_style = :expanded

# 开启行号
line_comments = false

# To enable relative paths to assets via compass helper functions. Uncomment:
relative_assets = true

# If you prefer the indented syntax, you might want to regenerate this
# project again passing --syntax sass, or you can uncomment this:
# preferred_syntax = :sass
# and then run:
# sass-convert -R --from scss --to sass sass scss && rm -rf sass && mv scss sass