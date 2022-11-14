package com.khalibre.cec.profile.portlet;

import com.khalibre.cec.profile.constants.AccountSettingPortletKeys;

import com.liferay.frontend.js.loader.modules.extender.npm.NPMResolver;
import com.liferay.portal.kernel.portlet.bridges.mvc.MVCPortlet;

import java.io.IOException;

import javax.portlet.Portlet;
import javax.portlet.PortletException;
import javax.portlet.RenderRequest;
import javax.portlet.RenderResponse;

import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

/**
 * @author kosalvireak
 */
@Component(
	immediate = true,
	property = {
		"com.liferay.portlet.display-category=category.sample",
		"com.liferay.portlet.instanceable=true",
			"com.liferay.portlet.css-class-wrapper=portlet-account-setting-wrapper",
			"javax.portlet.init-param.template-path=/",
			"javax.portlet.supports.mime-type=text/html",
			"com.liferay.portlet.header-portlet-css=/css/account_setting.css",
			"javax.portlet.init-param.view-template=/html/account_settings/view.jsp",
		"javax.portlet.name=" + AccountSettingPortletKeys.AccountSetting,
		"javax.portlet.resource-bundle=content.Language",
		"javax.portlet.security-role-ref=power-user,user"
	},
	service = Portlet.class
)
public class AccountSettingPortlet extends MVCPortlet {

}