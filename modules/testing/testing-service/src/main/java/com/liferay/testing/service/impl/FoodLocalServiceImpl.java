/**
 * Copyright (c) 2000-present Liferay, Inc. All rights reserved.
 *
 * This library is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Lesser General Public License as published by the Free
 * Software Foundation; either version 2.1 of the License, or (at your option)
 * any later version.
 *
 * This library is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more
 * details.
 */

package com.liferay.testing.service.impl;

import com.liferay.journal.exception.FolderNameException;
import com.liferay.portal.aop.AopService;
import com.liferay.portal.kernel.exception.PortalException;
import com.liferay.portal.kernel.model.User;
import com.liferay.portal.kernel.service.ServiceContext;
import com.liferay.portal.kernel.util.OrderByComparator;
import com.liferay.portal.kernel.util.Validator;
import com.liferay.testing.model.Food;
import com.liferay.testing.service.base.FoodLocalServiceBaseImpl;

import org.osgi.service.component.annotations.Component;

import java.util.Date;
import java.util.List;


/**
 * @author Brian Wing Shun Chan
 */
@Component(
	property = "model.class.name=com.liferay.testing.model.Food",
	service = AopService.class
)
public class FoodLocalServiceImpl extends FoodLocalServiceBaseImpl {
	public Food addFood(long userId, String name,ServiceContext serviceContext) throws PortalException {

		long groupId = serviceContext.getScopeGroupId();

		User user = userLocalService.getUserById(userId);

		Date now = new Date();

		validate(name);

		long guestbookId = counterLocalService.increment();


		Food food = foodPersistence.create(groupId);

		food.setUuid(serviceContext.getUuid());
		food.setUserId(userId);
		food.setGroupId(groupId);
		food.setCompanyId(user.getCompanyId());
		food.setUserName(user.getFullName());
		food.setCreateDate(serviceContext.getCreateDate(now));
		food.setUserName(name);
		food.setExpandoBridgeAttributes(serviceContext);
		foodPersistence.update(food);
		return food;

	}
	public List<Food> getFoods(long groupId){
		return foodPersistence.findByG_G(groupId);
	}
	public List<Food> getFoods(long groupId, int start, int end, OrderByComparator<Food> obc){
		return foodPersistence.findByG_G(groupId, start, end,obc);
	}
	public List<Food> getFoods(long groupId, int start, int end){
		return foodPersistence.findByG_G(groupId, start, end);
	}
	public int getFoodsCount(long groupId){
		return foodPersistence.countByG_G(groupId);
	}
	protected void validate(String name) throws PortalException{
		if(Validator.isNull(name)){
			throw new FolderNameException();
		}
	}
}