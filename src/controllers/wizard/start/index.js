import $ from 'jQuery';
import loading from 'loading';
import 'emby-button';
import 'emby-select';

function loadPage(page, config, languageOptions) {
    $('#selectLocalizationLanguage', page).html(languageOptions.map(function (l) {
        return '<option value="' + l.Value + '">' + l.Name + '</option>';
    })).val(config.UICulture);
    loading.hide();
}

function save(page) {
    loading.show();
    const apiClient = ApiClient;
    apiClient.getJSON(apiClient.getUrl('Startup/Configuration')).then(function (config) {
        config.UICulture = $('#selectLocalizationLanguage', page).val();
        apiClient.ajax({
            type: 'POST',
            data: config,
            url: apiClient.getUrl('Startup/Configuration')
        }).then(function () {
            Dashboard.navigate('wizarduser.html');
        });
    });
}

function onSubmit() {
    save($(this).parents('.page'));
    return false;
}

export default function (view, params) {
    $('.wizardStartForm', view).on('submit', onSubmit);
    view.addEventListener('viewshow', function () {
        document.querySelector('.skinHeader').classList.add('noHomeButtonHeader');
        loading.show();
        const page = this;
        const apiClient = ApiClient;
        const promise1 = apiClient.getJSON(apiClient.getUrl('Startup/Configuration'));
        const promise2 = apiClient.getJSON(apiClient.getUrl('Localization/Options'));
        Promise.all([promise1, promise2]).then(function (responses) {
            loadPage(page, responses[0], responses[1]);
        });
    });
    view.addEventListener('viewhide', function () {
        document.querySelector('.skinHeader').classList.remove('noHomeButtonHeader');
    });
}
