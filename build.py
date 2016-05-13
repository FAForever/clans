from __future__ import print_function
from jinja2 import Environment, FileSystemLoader
import os, shutil

env = Environment(loader=FileSystemLoader('templates'))

pages = ['index', 'clans', 'clan', 'clan_members']

if (os.path.isdir('dist')):
    shutil.rmtree('dist')
shutil.copytree('static', 'dist')

for page in pages:
    template = page + '.html'
    html = env.get_template(template)
    filepath = os.path.join('dist', template)
    with open (filepath, 'a') as f: 
        f.write(html.render())


