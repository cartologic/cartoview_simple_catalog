import json
import base64
import os
from cartoview.app_manager.models import App, AppInstance
from cartoview.app_manager.views import StandardAppViews
from geonode.maps.models import Map
from django.shortcuts import HttpResponse
from django.core.files.storage import FileSystemStorage
from django.core.files.base import ContentFile

from sys import stdout
import logging
from . import APP_NAME
formatter = logging.Formatter(
    '[%(asctime)s] p%(process)s  { %(name)s %(pathname)s:%(lineno)d} \
                            %(levelname)s - %(message)s', '%m-%d %H:%M:%S')
logger = logging.getLogger(__name__)
handler = logging.StreamHandler(stdout)
handler.setFormatter(formatter)
logger.addHandler(handler)
_js_permissions_mapping = {
    'whoCanView': 'view_resourcebase',
    'whoCanChangeMetadata': 'change_resourcebase_metadata',
    'whoCanDelete': 'delete_resourcebase',
    'whoCanChangeConfiguration': 'change_resourcebase'
}


def change_dict_None_to_list(access):
    for permission, users in list(access.items()):
        if not users:
            access[permission] = []


class Catalog(StandardAppViews):
    def get_users_permissions(self, access, initial, owner):
        change_dict_None_to_list(access)
        users = []
        for permission_users in list(access.values()):
            if permission_users:
                users.extend(permission_users)
        users = set(users)
        for user in users:
            user_permissions = []
            for js_permission, gaurdian_permission in \
                    list(_js_permissions_mapping.items()):
                if user in access[js_permission]:
                    user_permissions.append(gaurdian_permission)
            if len(user_permissions) > 0 and user != owner:
                initial['users'].update({'{}'.format(user): user_permissions})
        if not access["whoCanView"]:
            initial['users'].update({'AnonymousUser': [
                'view_resourcebase',
            ]})

    def save(self, request, instance_id=None):
        user = request.user
        res_json = dict(success=False)
        
        data = json.loads(request.POST.get('data'))
        files = request.FILES

        config = data.get('config', None)
        logger.error(config)
        resources = config['resources']
        title = data.get('title', "")
      
        thumbnail_img = files.get('thumbnail', None)
        logo_img = files.get('logo', None)
        
        print('thumbnail_img: ', thumbnail_img)
        uploaded_thumbnail_url = None
        uploaded_logo_url = None
        if thumbnail_img is not None:
            uploaded_thumbnail_url = save_attached_files(thumbnail_img)
        if logo_img is not None:
            uploaded_logo_url = save_attached_files(logo_img)
    
        access = data.get('access', None)
        keywords = data.get('keywords', [])
        config.update(access=access, keywords=keywords)
        config = json.dumps(data.get('config', None))
        abstract = data.get('abstract', "")
        if instance_id is None:
            instance_obj = AppInstance()
            instance_obj.app = App.objects.get(name=self.app_name)
            instance_obj.owner = user
        else:
            instance_obj = AppInstance.objects.get(pk=instance_id)
            user = instance_obj.owner

        instance_obj.title = title
        instance_obj.config = config
        instance_obj.abstract = abstract
        if uploaded_thumbnail_url is not None:
            instance_obj.thumbnail_url = uploaded_thumbnail_url
        if uploaded_logo_url is not None:
            instance_obj.logo = uploaded_logo_url

        if config:
            maps = Map.objects.filter(id__in=[int(id) for id in resources])
            if maps.count() > 0:
                instance_obj.map = maps[0]
            else:
                instance_obj.map = None
        instance_obj.save()
        owner_permissions = [
            'view_resourcebase',
            'download_resourcebase',
            'change_resourcebase_metadata',
            'change_resourcebase',
            'delete_resourcebase',
            'change_resourcebase_permissions',
            'publish_resourcebase',
        ]
        permessions = {
            'users': {
                '{}'.format(request.user.username): owner_permissions,
            }
        }
        self.get_users_permissions(access, permessions, user.username)
        instance_obj.set_permissions(permessions)
        if hasattr(instance_obj, 'keywords') and keywords:
            new_keywords = [
                k for k in keywords if k not in instance_obj.keyword_list()]
            instance_obj.keywords.add(*new_keywords)

        res_json.update(dict(success=True, id=instance_obj.id))
        return HttpResponse(json.dumps(res_json),
                            content_type="application/json")
   
    # override save_all function for (app_manager views)
    def save_all(self, request, instance_id=None):
        response = self.save(request, instance_id)
        return response

simple_catalog = Catalog(APP_NAME)

def save_attached_files (attached_file):
        fs = FileSystemStorage()
        saved_file = fs.save(attached_file.name, attached_file)
        saved_file_url = fs.url(saved_file)
        return saved_file_url