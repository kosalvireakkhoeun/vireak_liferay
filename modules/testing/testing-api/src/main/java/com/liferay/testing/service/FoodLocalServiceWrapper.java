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

package com.liferay.testing.service;

import com.liferay.portal.kernel.service.ServiceWrapper;

/**
 * Provides a wrapper for {@link FoodLocalService}.
 *
 * @author Brian Wing Shun Chan
 * @see FoodLocalService
 * @generated
 */
public class FoodLocalServiceWrapper
	implements FoodLocalService, ServiceWrapper<FoodLocalService> {

	public FoodLocalServiceWrapper() {
		this(null);
	}

	public FoodLocalServiceWrapper(FoodLocalService foodLocalService) {
		_foodLocalService = foodLocalService;
	}

	/**
	 * Adds the food to the database. Also notifies the appropriate model listeners.
	 *
	 * <p>
	 * <strong>Important:</strong> Inspect FoodLocalServiceImpl for overloaded versions of the method. If provided, use these entry points to the API, as the implementation logic may require the additional parameters defined there.
	 * </p>
	 *
	 * @param food the food
	 * @return the food that was added
	 */
	@Override
	public com.liferay.testing.model.Food addFood(
		com.liferay.testing.model.Food food) {

		return _foodLocalService.addFood(food);
	}

	/**
	 * Creates a new food with the primary key. Does not add the food to the database.
	 *
	 * @param foodId the primary key for the new food
	 * @return the new food
	 */
	@Override
	public com.liferay.testing.model.Food createFood(long foodId) {
		return _foodLocalService.createFood(foodId);
	}

	/**
	 * @throws PortalException
	 */
	@Override
	public com.liferay.portal.kernel.model.PersistedModel createPersistedModel(
			java.io.Serializable primaryKeyObj)
		throws com.liferay.portal.kernel.exception.PortalException {

		return _foodLocalService.createPersistedModel(primaryKeyObj);
	}

	/**
	 * Deletes the food from the database. Also notifies the appropriate model listeners.
	 *
	 * <p>
	 * <strong>Important:</strong> Inspect FoodLocalServiceImpl for overloaded versions of the method. If provided, use these entry points to the API, as the implementation logic may require the additional parameters defined there.
	 * </p>
	 *
	 * @param food the food
	 * @return the food that was removed
	 */
	@Override
	public com.liferay.testing.model.Food deleteFood(
		com.liferay.testing.model.Food food) {

		return _foodLocalService.deleteFood(food);
	}

	/**
	 * Deletes the food with the primary key from the database. Also notifies the appropriate model listeners.
	 *
	 * <p>
	 * <strong>Important:</strong> Inspect FoodLocalServiceImpl for overloaded versions of the method. If provided, use these entry points to the API, as the implementation logic may require the additional parameters defined there.
	 * </p>
	 *
	 * @param foodId the primary key of the food
	 * @return the food that was removed
	 * @throws PortalException if a food with the primary key could not be found
	 */
	@Override
	public com.liferay.testing.model.Food deleteFood(long foodId)
		throws com.liferay.portal.kernel.exception.PortalException {

		return _foodLocalService.deleteFood(foodId);
	}

	/**
	 * @throws PortalException
	 */
	@Override
	public com.liferay.portal.kernel.model.PersistedModel deletePersistedModel(
			com.liferay.portal.kernel.model.PersistedModel persistedModel)
		throws com.liferay.portal.kernel.exception.PortalException {

		return _foodLocalService.deletePersistedModel(persistedModel);
	}

	@Override
	public <T> T dslQuery(com.liferay.petra.sql.dsl.query.DSLQuery dslQuery) {
		return _foodLocalService.dslQuery(dslQuery);
	}

	@Override
	public int dslQueryCount(
		com.liferay.petra.sql.dsl.query.DSLQuery dslQuery) {

		return _foodLocalService.dslQueryCount(dslQuery);
	}

	@Override
	public com.liferay.portal.kernel.dao.orm.DynamicQuery dynamicQuery() {
		return _foodLocalService.dynamicQuery();
	}

	/**
	 * Performs a dynamic query on the database and returns the matching rows.
	 *
	 * @param dynamicQuery the dynamic query
	 * @return the matching rows
	 */
	@Override
	public <T> java.util.List<T> dynamicQuery(
		com.liferay.portal.kernel.dao.orm.DynamicQuery dynamicQuery) {

		return _foodLocalService.dynamicQuery(dynamicQuery);
	}

	/**
	 * Performs a dynamic query on the database and returns a range of the matching rows.
	 *
	 * <p>
	 * Useful when paginating results. Returns a maximum of <code>end - start</code> instances. <code>start</code> and <code>end</code> are not primary keys, they are indexes in the result set. Thus, <code>0</code> refers to the first result in the set. Setting both <code>start</code> and <code>end</code> to <code>com.liferay.portal.kernel.dao.orm.QueryUtil#ALL_POS</code> will return the full result set. If <code>orderByComparator</code> is specified, then the query will include the given ORDER BY logic. If <code>orderByComparator</code> is absent, then the query will include the default ORDER BY logic from <code>com.liferay.testing.model.impl.FoodModelImpl</code>.
	 * </p>
	 *
	 * @param dynamicQuery the dynamic query
	 * @param start the lower bound of the range of model instances
	 * @param end the upper bound of the range of model instances (not inclusive)
	 * @return the range of matching rows
	 */
	@Override
	public <T> java.util.List<T> dynamicQuery(
		com.liferay.portal.kernel.dao.orm.DynamicQuery dynamicQuery, int start,
		int end) {

		return _foodLocalService.dynamicQuery(dynamicQuery, start, end);
	}

	/**
	 * Performs a dynamic query on the database and returns an ordered range of the matching rows.
	 *
	 * <p>
	 * Useful when paginating results. Returns a maximum of <code>end - start</code> instances. <code>start</code> and <code>end</code> are not primary keys, they are indexes in the result set. Thus, <code>0</code> refers to the first result in the set. Setting both <code>start</code> and <code>end</code> to <code>com.liferay.portal.kernel.dao.orm.QueryUtil#ALL_POS</code> will return the full result set. If <code>orderByComparator</code> is specified, then the query will include the given ORDER BY logic. If <code>orderByComparator</code> is absent, then the query will include the default ORDER BY logic from <code>com.liferay.testing.model.impl.FoodModelImpl</code>.
	 * </p>
	 *
	 * @param dynamicQuery the dynamic query
	 * @param start the lower bound of the range of model instances
	 * @param end the upper bound of the range of model instances (not inclusive)
	 * @param orderByComparator the comparator to order the results by (optionally <code>null</code>)
	 * @return the ordered range of matching rows
	 */
	@Override
	public <T> java.util.List<T> dynamicQuery(
		com.liferay.portal.kernel.dao.orm.DynamicQuery dynamicQuery, int start,
		int end,
		com.liferay.portal.kernel.util.OrderByComparator<T> orderByComparator) {

		return _foodLocalService.dynamicQuery(
			dynamicQuery, start, end, orderByComparator);
	}

	/**
	 * Returns the number of rows matching the dynamic query.
	 *
	 * @param dynamicQuery the dynamic query
	 * @return the number of rows matching the dynamic query
	 */
	@Override
	public long dynamicQueryCount(
		com.liferay.portal.kernel.dao.orm.DynamicQuery dynamicQuery) {

		return _foodLocalService.dynamicQueryCount(dynamicQuery);
	}

	/**
	 * Returns the number of rows matching the dynamic query.
	 *
	 * @param dynamicQuery the dynamic query
	 * @param projection the projection to apply to the query
	 * @return the number of rows matching the dynamic query
	 */
	@Override
	public long dynamicQueryCount(
		com.liferay.portal.kernel.dao.orm.DynamicQuery dynamicQuery,
		com.liferay.portal.kernel.dao.orm.Projection projection) {

		return _foodLocalService.dynamicQueryCount(dynamicQuery, projection);
	}

	@Override
	public com.liferay.testing.model.Food fetchFood(long foodId) {
		return _foodLocalService.fetchFood(foodId);
	}

	/**
	 * Returns the food matching the UUID and group.
	 *
	 * @param uuid the food's UUID
	 * @param groupId the primary key of the group
	 * @return the matching food, or <code>null</code> if a matching food could not be found
	 */
	@Override
	public com.liferay.testing.model.Food fetchFoodByUuidAndGroupId(
		String uuid, long groupId) {

		return _foodLocalService.fetchFoodByUuidAndGroupId(uuid, groupId);
	}

	@Override
	public com.liferay.portal.kernel.dao.orm.ActionableDynamicQuery
		getActionableDynamicQuery() {

		return _foodLocalService.getActionableDynamicQuery();
	}

	@Override
	public com.liferay.portal.kernel.dao.orm.ExportActionableDynamicQuery
		getExportActionableDynamicQuery(
			com.liferay.exportimport.kernel.lar.PortletDataContext
				portletDataContext) {

		return _foodLocalService.getExportActionableDynamicQuery(
			portletDataContext);
	}

	/**
	 * Returns the food with the primary key.
	 *
	 * @param foodId the primary key of the food
	 * @return the food
	 * @throws PortalException if a food with the primary key could not be found
	 */
	@Override
	public com.liferay.testing.model.Food getFood(long foodId)
		throws com.liferay.portal.kernel.exception.PortalException {

		return _foodLocalService.getFood(foodId);
	}

	/**
	 * Returns the food matching the UUID and group.
	 *
	 * @param uuid the food's UUID
	 * @param groupId the primary key of the group
	 * @return the matching food
	 * @throws PortalException if a matching food could not be found
	 */
	@Override
	public com.liferay.testing.model.Food getFoodByUuidAndGroupId(
			String uuid, long groupId)
		throws com.liferay.portal.kernel.exception.PortalException {

		return _foodLocalService.getFoodByUuidAndGroupId(uuid, groupId);
	}

	/**
	 * Returns a range of all the foods.
	 *
	 * <p>
	 * Useful when paginating results. Returns a maximum of <code>end - start</code> instances. <code>start</code> and <code>end</code> are not primary keys, they are indexes in the result set. Thus, <code>0</code> refers to the first result in the set. Setting both <code>start</code> and <code>end</code> to <code>com.liferay.portal.kernel.dao.orm.QueryUtil#ALL_POS</code> will return the full result set. If <code>orderByComparator</code> is specified, then the query will include the given ORDER BY logic. If <code>orderByComparator</code> is absent, then the query will include the default ORDER BY logic from <code>com.liferay.testing.model.impl.FoodModelImpl</code>.
	 * </p>
	 *
	 * @param start the lower bound of the range of foods
	 * @param end the upper bound of the range of foods (not inclusive)
	 * @return the range of foods
	 */
	@Override
	public java.util.List<com.liferay.testing.model.Food> getFoods(
		int start, int end) {

		return _foodLocalService.getFoods(start, end);
	}

	/**
	 * Returns all the foods matching the UUID and company.
	 *
	 * @param uuid the UUID of the foods
	 * @param companyId the primary key of the company
	 * @return the matching foods, or an empty list if no matches were found
	 */
	@Override
	public java.util.List<com.liferay.testing.model.Food>
		getFoodsByUuidAndCompanyId(String uuid, long companyId) {

		return _foodLocalService.getFoodsByUuidAndCompanyId(uuid, companyId);
	}

	/**
	 * Returns a range of foods matching the UUID and company.
	 *
	 * @param uuid the UUID of the foods
	 * @param companyId the primary key of the company
	 * @param start the lower bound of the range of foods
	 * @param end the upper bound of the range of foods (not inclusive)
	 * @param orderByComparator the comparator to order the results by (optionally <code>null</code>)
	 * @return the range of matching foods, or an empty list if no matches were found
	 */
	@Override
	public java.util.List<com.liferay.testing.model.Food>
		getFoodsByUuidAndCompanyId(
			String uuid, long companyId, int start, int end,
			com.liferay.portal.kernel.util.OrderByComparator
				<com.liferay.testing.model.Food> orderByComparator) {

		return _foodLocalService.getFoodsByUuidAndCompanyId(
			uuid, companyId, start, end, orderByComparator);
	}

	/**
	 * Returns the number of foods.
	 *
	 * @return the number of foods
	 */
	@Override
	public int getFoodsCount() {
		return _foodLocalService.getFoodsCount();
	}

	@Override
	public com.liferay.portal.kernel.dao.orm.IndexableActionableDynamicQuery
		getIndexableActionableDynamicQuery() {

		return _foodLocalService.getIndexableActionableDynamicQuery();
	}

	/**
	 * Returns the OSGi service identifier.
	 *
	 * @return the OSGi service identifier
	 */
	@Override
	public String getOSGiServiceIdentifier() {
		return _foodLocalService.getOSGiServiceIdentifier();
	}

	/**
	 * @throws PortalException
	 */
	@Override
	public com.liferay.portal.kernel.model.PersistedModel getPersistedModel(
			java.io.Serializable primaryKeyObj)
		throws com.liferay.portal.kernel.exception.PortalException {

		return _foodLocalService.getPersistedModel(primaryKeyObj);
	}

	/**
	 * Updates the food in the database or adds it if it does not yet exist. Also notifies the appropriate model listeners.
	 *
	 * <p>
	 * <strong>Important:</strong> Inspect FoodLocalServiceImpl for overloaded versions of the method. If provided, use these entry points to the API, as the implementation logic may require the additional parameters defined there.
	 * </p>
	 *
	 * @param food the food
	 * @return the food that was updated
	 */
	@Override
	public com.liferay.testing.model.Food updateFood(
		com.liferay.testing.model.Food food) {

		return _foodLocalService.updateFood(food);
	}

	@Override
	public FoodLocalService getWrappedService() {
		return _foodLocalService;
	}

	@Override
	public void setWrappedService(FoodLocalService foodLocalService) {
		_foodLocalService = foodLocalService;
	}

	private FoodLocalService _foodLocalService;

}