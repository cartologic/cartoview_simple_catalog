from django import forms
from django.templatetags.static import static
from cartoview.app_manager.forms import AppInstanceForm
from . import APP_NAME
import json

class MapForm(AppInstanceForm):
    class Meta(AppInstanceForm.Meta):
        model = CartoviewMap


class ConfigForm(forms.ModelForm):
    show_left_panel = forms.BooleanField(required=False)
    left_panel_content = forms.CharField(widget=forms.Textarea, required=False)
    show_right_panel = forms.BooleanField(required=False)
    right_panel_content = forms.CharField(widget=forms.Textarea, required=False)
    show_bottom_panel = forms.BooleanField(required=False)
    bottom_panel_content = forms.CharField(widget=forms.Textarea, required=False)

    def set_initial_field_value(self,f_name):
        if f_name in  self.instance.config_obj:
            self.fields[f_name].initial = self.instance.config_obj[f_name]

    def __init__(self, *args, **kwargs):
        super(ConfigForm, self).__init__(*args, **kwargs)
        if self.instance.pk is not None:
            for f_name in self.fields.keys():
                self.set_initial_field_value(f_name)

    def clean(self):
        super(ConfigForm, self).clean()
        self.cleaned_data["config"] = json.dumps(self.cleaned_data)
        return self.cleaned_data
    class Meta:
        model = CartoviewMap
        fields = []


    class Media:
        # css = {all:[]}
        js = [static( APP_NAME + "/config_form.js")]
