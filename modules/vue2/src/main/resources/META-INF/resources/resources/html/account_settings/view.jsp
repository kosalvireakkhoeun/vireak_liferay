<%@ include file="/html/account_settings/init.jsp" %>

<%
    ActivitiesGroupDisplayContext activityContext = new ActivitiesGroupDisplayContext(request);
    ProfileDisplayContext profileContext = new ProfileDisplayContext(request, ProfileType.PRIVATE.getValue());
    UserProfile profile = profileContext.getProfile();
    boolean showSaveButton = false;
%>

<portlet:actionURL var="saveAccountSetting" name="/account-setting/save"/>

<div class="portlet-content">
    <h2 class="portlet-title-text d-inline-block"><%=LanguageUtil.get(request,"account-settings")%></h2>
</div>

<aui:form name="frmAccountSetting" action="<%=saveAccountSetting.toString()%>" method="post" >
    <aui:fieldset-group markupView="lexicon">
         <%@ include file="element/general.jspf" %>

         <%if(profileContext.checkUserHasPermissionUpdatePassword()){%>
            <%@ include file="element/password.jspf" %>
         <%}else{%>
            <%@ include file="element/password-no-update-permission.jspf" %>
         <%}%>

         <%@ include file="element/notification.jspf" %>
        <aui:button-row>
            <aui:button name="submit" value="save" type="submit"/>
        </aui:button-row>
    </aui:fieldset-group>
</aui:form>


