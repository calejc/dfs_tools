class Config(object):
  DEBUG = True
  TESTING = True
  CSRF_ENABLED = False
  SQLALCHEMY_TRACK_MODIFICATIONS = False
  SQLALCHEMY_DATABASE_URI = 'sqlite:////home/cale/Dropbox/code/opto/api/db.db'