from itty import *

MY_ROOT = os.path.join(os.path.dirname(__file__), 'media')

# To serve static files, simply setup a standard @get method. You should
# capture the filename/path and get the content-type. If your media root is
# different than where your ``itty.py`` lives, manually setup your root
# directory as well. Finally, use the ``static_file`` helper to serve up the
# file.
@get('/(?P<filename>.+)')
def my_media(request, filename):
    output = static_file(filename, root=MY_ROOT)
    return Response(output, content_type=content_type(filename))

run_itty()
