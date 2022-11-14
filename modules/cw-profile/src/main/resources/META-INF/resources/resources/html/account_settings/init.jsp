<%@
taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %><%@
taglib uri="http://java.sun.com/portlet_2_0" prefix="portlet" %><%@
taglib uri="http://liferay.com/tld/aui" prefix="aui" %><%@
taglib uri="http://liferay.com/tld/frontend" prefix="liferay-frontend" %><%@
taglib uri="http://liferay.com/tld/portlet" prefix="liferay-portlet" %><%@
taglib uri="http://liferay.com/tld/theme" prefix="liferay-theme" %><%@
taglib uri="http://liferay.com/tld/ui" prefix="liferay-ui" %><%@
taglib uri="http://liferay.com/tld/util" prefix="liferay-util"%>

<%@page import="com.liferay.portal.kernel.language.LanguageUtil"%>
<%@page import="javax.portlet.PortletURL" %>
<%@page import="com.liferay.portal.kernel.portlet.LiferayWindowState" %>
<%@page import="com.liferay.portal.kernel.util.PrefsPropsUtil"%>
<%@page import="com.liferay.portal.kernel.util.PropsKeys" %>
<%@page import="com.liferay.portal.kernel.util.GetterUtil" %>
<%@page import="com.liferay.portal.kernel.portlet.PortletProviderUtil" %>
<%@page import="com.liferay.portal.kernel.portlet.PortletProvider" %>
<%@page import="com.liferay.portal.kernel.util.PortalUtil" %>
<%@page import="java.util.List" %>
<%@page import="com.liferay.portal.kernel.util.StringUtil" %>
<%@page import="com.liferay.portal.kernel.util.Validator" %>
<%@page import="com.liferay.portal.kernel.util.CalendarFactoryUtil" %>
<%@page import="java.util.Calendar" %>
<%@page import="java.util.ArrayList" %>
<%@page import="com.liferay.portal.kernel.util.StringUtil" %>
<%@page import="com.liferay.portal.kernel.util.LocaleUtil" %>
<%@page import="java.util.Locale" %>
<%@page import="com.liferay.portal.util.PropsValues" %>
<%@page import="com.liferay.portal.kernel.util.SetUtil" %>
<%@page import="com.khalibre.database.exception.SamlIdentityNotFoundException" %>
<%@page import="com.liferay.portal.kernel.exception.NoSuchTicketException" %>
<%@page import="com.liferay.portal.kernel.exception.NoSuchUserException" %>
<%@page import="com.liferay.portal.kernel.language.LanguageUtil"%>
<%@page import="com.liferay.portal.kernel.servlet.SessionErrors" %>
<%@page import="com.liferay.portal.kernel.util.JavaConstants"%>
<%@page import="com.liferay.portal.kernel.util.ParamUtil"%>
<%@page import="java.io.UnsupportedEncodingException" %>
<%@page import="javax.mail.internet.AddressException" %>
<%@page import="javax.portlet.PortletRequest" %>
<%@page import="com.liferay.portal.kernel.util.PortletKeys" %>
<%@page import="com.liferay.portal.kernel.portlet.PortletURLFactoryUtil" %>
<%@page import="javax.portlet.PortletRequest"%>
<%@page import="com.liferay.portal.kernel.util.JavaConstants" %>
<%@page import="com.liferay.portal.kernel.servlet.SessionErrors" %>
<%@page import="com.liferay.portal.kernel.exception.PortalException" %>
<%@page import="com.khalibre.database.exception.SamlIdentityNotFoundException" %>
<%@page import="com.khalibre.domain.useraccount.ProfileType" %>
<%@page import="com.khalibre.database.model.UserProfile" %>

<%@page import="com.khalibre.database.model.ActivitiesGroup"%>
<%@page import="com.khalibre.database.service.ActivitiesGroupLocalServiceUtil" %>
<%@page import="com.khalibre.database.model.Activity" %>
<%@page import="com.khalibre.database.model.ActivitiesGroupConnection" %>
<%@page import="com.khalibre.database.service.ActivitiesGroupConnectionLocalServiceUtil" %>
<%@page import="com.khalibre.database.model.UserProfileNotificationSetting" %>

<%@page import="com.khalibre.cec.profile.portlet.model.ContactEmailAddress" %>
<%@page import="com.khalibre.cec.profile.display.context.ProfileDisplayContext" %>
<%@page import="com.khalibre.cec.profile.display.context.ActivitiesGroupDisplayContext" %>


<liferay-theme:defineObjects />

<portlet:defineObjects />

<%
String mainRequire = (String)renderRequest.getAttribute("mainRequire");
String baseResourceUrl = PortletURLFactoryUtil.create(request, portletDisplay.getId(), PortletRequest.RESOURCE_PHASE).toString();
String baseActionUrl = PortletURLFactoryUtil.create(request, portletDisplay.getId(), PortletRequest.ACTION_PHASE).toString();
ProfileDisplayContext profileDisplayContext = new ProfileDisplayContext(request);
%>
