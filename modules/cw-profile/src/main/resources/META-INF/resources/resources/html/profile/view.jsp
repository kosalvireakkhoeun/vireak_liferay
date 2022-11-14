<%@ include file="/html/profile/init.jsp" %>

<div id="<portlet:namespace />profile" class="cec-mt-4">
    <toast
        ref="toasted"
        :timeout="5000"
        :fade-to="false"
        css-class="justify-content-center"
        :is-full-width="true">
    </toast>
    <profile-setting-sidebar ref="setting" class="cec-ml-4"></profile-setting-sidebar>
    <template v-if="!isEditMode">
        <view-profile
            v-if="!isLoading"
            @switch-mode="onSwitchMode"
        ></view-profile>
    </template>
    <edit-profile
        v-else
        :component-name="componentName"
        @switch-mode="onSwitchMode('profileDetail')"
    ></edit-profile>
</div>

<%@ include file="/html/profile/translation.jsp" %>

<aui:script require="<%= mainRequire %>">
    main.default.createContext('<portlet:namespace />', themeDisplay)
    .defineElementByRelId('root', 'profile')
    .setBaseResourceUrl('<%= baseResourceUrl %>')
    .setBaseActionUrl('<%= baseActionUrl %>')
    .setBaseRenderUrl('<%= baseRenderUrl %>')
    .setData('userIdpUuid', '<%= userIdpUuid %>')
    .setData('previewAs', '<%= ParamUtil.getString(request, "previewAs") %>')
    .setData('translation', translation)
    .init();
</aui:script>
