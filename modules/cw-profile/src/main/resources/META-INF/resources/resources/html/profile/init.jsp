<%@ include file="/html/init.jsp" %>
<%@ page import="com.liferay.portal.kernel.portlet.PortletURLFactoryUtil" %>
<%@ page import="javax.portlet.PortletRequest" %>
<%@ page import="com.liferay.portal.kernel.util.ParamUtil" %>
<%@ page import="com.khalibre.database.service.SamlIdentityLocalServiceUtil" %>

<%
    String baseRenderUrl = PortletURLFactoryUtil.create(request, portletDisplay.getId(), PortletRequest.RENDER_PHASE).toString();
    String baseResourceUrl = PortletURLFactoryUtil.create(request, portletDisplay.getId(), PortletRequest.RESOURCE_PHASE).toString();
    String baseActionUrl = PortletURLFactoryUtil.create(request, portletDisplay.getId(), PortletRequest.ACTION_PHASE).toString();
    String userIdpUuid = ParamUtil.getString(request, "userIdpUuid", SamlIdentityLocalServiceUtil.getIdpUuid(themeDisplay.getUser()));
%>
