from django.db import models
from geonode.maps.models import Map as GeonodeMap
from cartoview.app_manager.models import AppInstance
import json


class CatalogConfig(object):
    def __init__(self, request=None, catalog=None):
        self.__dict__.update(layers='false',
                             maps='false',
                             apps='false',
                             documents='false',
                             featured='false',
                             keywords=None)
        if request is not None:
            for key in self.__dict__.keys():
                self.__dict__[key] = request.REQUEST.get(key, self.__dict__[key])
        elif catalog is not None:
            params = catalog.config.split("&")
            for param in params:
                key_value = param.split("=")
                self.__dict__[key_value[0]] = key_value[1]

        self.keywords = [] if self.keywords is None or self.keywords == "" else self.keywords.split(",")
        self.keywords = [keyword.strip() for keyword in self.keywords]

    def __str__(self):
        return json.dumps(self.__dict__)


class Catalog(AppInstance):
    config = models.TextField(null=True, blank=True)