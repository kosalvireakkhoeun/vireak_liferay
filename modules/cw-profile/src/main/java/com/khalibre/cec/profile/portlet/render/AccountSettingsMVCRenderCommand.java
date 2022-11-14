package com.khalibre.cec.profile.portlet.render;

import com.khalibre.cec.profile.constants.AccountSettingPortletKeys;
import com.liferay.frontend.js.loader.modules.extender.npm.NPMResolver;
import com.liferay.portal.kernel.portlet.bridges.mvc.MVCRenderCommand;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

import javax.portlet.PortletException;
import javax.portlet.RenderRequest;
import javax.portlet.RenderResponse;

@Component(
  immediate = true,
  property = {
    "javax.portlet.name=" + AccountSettingPortletKeys.AccountSetting,
    "mvc.command.name=/"
  },
  service = MVCRenderCommand.class
)
public class AccountSettingsMVCRenderCommand implements MVCRenderCommand {

  @Reference
  private NPMResolver npmResolver;

  @Override
  public String render(RenderRequest renderRequest,
    RenderResponse renderResponse) throws PortletException {
    renderRequest.setAttribute(
      "mainRequire",
      npmResolver.resolveModuleName("cw-profile") + "/js/account_settings/account_settings.es as main");

    //TODO: rename main.jsp to view.jsp after refactoring
    return "/html/account_settings/main.jsp";
  }
}
