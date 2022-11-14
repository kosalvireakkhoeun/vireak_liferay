<%@ include file="/html/account_settings/init.jsp" %>

<div id="<portlet:namespace />accountSettings">
    <div v-if="reRenderComponent">
        <account-settings-navbar
            :options="options"
            :selected-option="selectedOptionKey"
            icon="settings-user"
            @on-change-option="onChangeOption"
        ></account-settings-navbar>
    </div>
    <div class="row">
        <div class="account-settings-wrapper col-12">
            <cw-card-panel-two-column
                v-if="selectedOptionKey !== 'activity-log'"
                :show-right-header="false">
                <template #right-body>
                    <need-help
                        :url="helpGuideUrl"
                        css-class-wrapper="cec-p-6 d-none d-md-block">
                    </need-help>
                </template>
                <template>
                    <template v-for="option in options">
                        <template v-if="selectedOptionKey === option.key">
                            <component
                                v-if="reRenderComponent"
                                :is="getComponentNameForDropdown(option.key)"
                                :user-email-address="themeDisplay.getUserEmailAddress()"
                                :minimum-password-length="minimumPasswordLength"
                                :selected-option="selectedOption">
                            </component>
                        </template>
                    </template>
                    <need-help
                        :url="helpGuideUrl"
                        css-class-wrapper="cec-p-6 d-md-none">
                    </need-help>
                </template>
            </cw-card-panel-two-column>
            <cw-card-panel-two-column-small-left-side v-else
                css-wrapper-class="border-rounded"
                css-right-header-class="d-sm-flex d-none align-item-center cec-pl-5"
                :hide-divider="true">
                <template #top-header>
                    <span class="font-size-22 font-weight-lighter">
                        {{ translate('activity-log') }}
                    </span>
                </template>
                <template #left-body>
                    <cw-dropdown
                        :value="selectedCategory.key"
                        :items="activityCategories"
                        :change-icon-on-mobile="false"
                        class-wrapper="d-block d-sm-none cec-m-4"
                        css-toggle="py-4"
                        @change="onSwitchCategory"
                    ></cw-dropdown>
                    <div class="d-none d-sm-flex flex-column cec-mt-1">
                        <template v-for="category in activityCategories">
                            <a href="javascript:;"
                               class="cec-pl-5 cec-py-3 text-decoration-none text-black text-noselect"
                               :class="{ 'font-weight-bold bg-gray-lighter-alt1' : category.key == selectedCategory.key }"
                               @click="onSwitchCategory(category, false)">
                               {{ category.value }}
                            </a>
                        </template>
                    </div>
                </template>
                <template>
                    <activity-log
                        ref="activityLog"
                        :category="selectedCategory"
                    ></activity-log>
                </template>
            </cw-card-panel-two-column-small-left-side>
        </div>
    </div>
</div>
<%@ include file="./translation.jsp" %>
<aui:script require="<%= mainRequire %>">
    main.default.createContext('<portlet:namespace />', themeDisplay)
    .defineElementByRelId('root', 'accountSettings')
    .setBaseResourceUrl('<%= baseResourceUrl %>')
    .setBaseActionUrl('<%= baseActionUrl %>')
    .setData('translation', translation)
    .setData('accountSettingOptions', <%=profileDisplayContext.getAccountSettingOptionsJson()%>)
    .setData('canUpdatePassword', <%=profileDisplayContext.checkUserHasPermissionUpdatePassword()%>)
    .setData('minimumPasswordLength', <%= profileDisplayContext.getOrgPolicyMinimumPasswordLength() %>)
    .setData('option', '<%= ParamUtil.getString(request, "option") %>')
    .init();
</aui:script>

