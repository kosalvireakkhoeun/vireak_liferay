package com.liferay.docs.guestbook.portlet.portlet;

import com.liferay.docs.guestbook.portlet.constants.GuestbookWebPortletKeys;

import com.liferay.docs.guestbook.service.GuestbookEntryLocalService;
import com.liferay.docs.guestbook.service.GuestbookLocalService;
import com.liferay.portal.kernel.portlet.bridges.mvc.MVCPortlet;

import javax.portlet.Portlet;

import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

/**
 * @author kosalvireak
 */
@Component(
        immediate = true,
        property = {
                "com.liferay.portlet.display-category=category.social",
                "com.liferay.portlet.instanceable=false",
                "com.liferay.portlet.scopeable=true",
                "javax.portlet.display-name=Guestbook",
                "javax.portlet.expiration-cache=0",
                "javax.portlet.init-param.template-path=/",
                "javax.portlet.init-param.view-template=/guestbook/view.jsp",
                "javax.portlet.resource-bundle=content.Language",
                "javax.portlet.security-role-ref=power-user,user",
                "javax.portlet.supports.mime-type=text/html",
                "javax.portlet.name=" + GuestbookWebPortletKeys.GUESTBOOKWEB,
        },
        service = Portlet.class
)
public class GuestbookWebPortlet extends MVCPortlet {

        @Reference
        private GuestbookEntryLocalService _guestbookEntryLocalService;

        @Reference
        private GuestbookLocalService _guestbookLocalService;
}