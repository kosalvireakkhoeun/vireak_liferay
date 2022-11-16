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

package com.liferay.testing.service.persistence;

import com.liferay.portal.kernel.service.persistence.BasePersistence;
import com.liferay.testing.exception.NoSuchFoodException;
import com.liferay.testing.model.Food;

import org.osgi.annotation.versioning.ProviderType;

/**
 * The persistence interface for the food service.
 *
 * <p>
 * Caching information and settings can be found in <code>portal.properties</code>
 * </p>
 *
 * @author Brian Wing Shun Chan
 * @see FoodUtil
 * @generated
 */
@ProviderType
public interface FoodPersistence extends BasePersistence<Food> {

	/*
	 * NOTE FOR DEVELOPERS:
	 *
	 * Never modify or reference this interface directly. Always use {@link FoodUtil} to access the food persistence. Modify <code>service.xml</code> and rerun ServiceBuilder to regenerate this interface.
	 */

	/**
	 * Returns all the foods where uuid = &#63;.
	 *
	 * @param uuid the uuid
	 * @return the matching foods
	 */
	public java.util.List<Food> findByUuid(String uuid);

	/**
	 * Returns a range of all the foods where uuid = &#63;.
	 *
	 * <p>
	 * Useful when paginating results. Returns a maximum of <code>end - start</code> instances. <code>start</code> and <code>end</code> are not primary keys, they are indexes in the result set. Thus, <code>0</code> refers to the first result in the set. Setting both <code>start</code> and <code>end</code> to <code>QueryUtil#ALL_POS</code> will return the full result set. If <code>orderByComparator</code> is specified, then the query will include the given ORDER BY logic. If <code>orderByComparator</code> is absent, then the query will include the default ORDER BY logic from <code>FoodModelImpl</code>.
	 * </p>
	 *
	 * @param uuid the uuid
	 * @param start the lower bound of the range of foods
	 * @param end the upper bound of the range of foods (not inclusive)
	 * @return the range of matching foods
	 */
	public java.util.List<Food> findByUuid(String uuid, int start, int end);

	/**
	 * Returns an ordered range of all the foods where uuid = &#63;.
	 *
	 * <p>
	 * Useful when paginating results. Returns a maximum of <code>end - start</code> instances. <code>start</code> and <code>end</code> are not primary keys, they are indexes in the result set. Thus, <code>0</code> refers to the first result in the set. Setting both <code>start</code> and <code>end</code> to <code>QueryUtil#ALL_POS</code> will return the full result set. If <code>orderByComparator</code> is specified, then the query will include the given ORDER BY logic. If <code>orderByComparator</code> is absent, then the query will include the default ORDER BY logic from <code>FoodModelImpl</code>.
	 * </p>
	 *
	 * @param uuid the uuid
	 * @param start the lower bound of the range of foods
	 * @param end the upper bound of the range of foods (not inclusive)
	 * @param orderByComparator the comparator to order the results by (optionally <code>null</code>)
	 * @return the ordered range of matching foods
	 */
	public java.util.List<Food> findByUuid(
		String uuid, int start, int end,
		com.liferay.portal.kernel.util.OrderByComparator<Food>
			orderByComparator);

	/**
	 * Returns an ordered range of all the foods where uuid = &#63;.
	 *
	 * <p>
	 * Useful when paginating results. Returns a maximum of <code>end - start</code> instances. <code>start</code> and <code>end</code> are not primary keys, they are indexes in the result set. Thus, <code>0</code> refers to the first result in the set. Setting both <code>start</code> and <code>end</code> to <code>QueryUtil#ALL_POS</code> will return the full result set. If <code>orderByComparator</code> is specified, then the query will include the given ORDER BY logic. If <code>orderByComparator</code> is absent, then the query will include the default ORDER BY logic from <code>FoodModelImpl</code>.
	 * </p>
	 *
	 * @param uuid the uuid
	 * @param start the lower bound of the range of foods
	 * @param end the upper bound of the range of foods (not inclusive)
	 * @param orderByComparator the comparator to order the results by (optionally <code>null</code>)
	 * @param useFinderCache whether to use the finder cache
	 * @return the ordered range of matching foods
	 */
	public java.util.List<Food> findByUuid(
		String uuid, int start, int end,
		com.liferay.portal.kernel.util.OrderByComparator<Food>
			orderByComparator,
		boolean useFinderCache);

	/**
	 * Returns the first food in the ordered set where uuid = &#63;.
	 *
	 * @param uuid the uuid
	 * @param orderByComparator the comparator to order the set by (optionally <code>null</code>)
	 * @return the first matching food
	 * @throws NoSuchFoodException if a matching food could not be found
	 */
	public Food findByUuid_First(
			String uuid,
			com.liferay.portal.kernel.util.OrderByComparator<Food>
				orderByComparator)
		throws NoSuchFoodException;

	/**
	 * Returns the first food in the ordered set where uuid = &#63;.
	 *
	 * @param uuid the uuid
	 * @param orderByComparator the comparator to order the set by (optionally <code>null</code>)
	 * @return the first matching food, or <code>null</code> if a matching food could not be found
	 */
	public Food fetchByUuid_First(
		String uuid,
		com.liferay.portal.kernel.util.OrderByComparator<Food>
			orderByComparator);

	/**
	 * Returns the last food in the ordered set where uuid = &#63;.
	 *
	 * @param uuid the uuid
	 * @param orderByComparator the comparator to order the set by (optionally <code>null</code>)
	 * @return the last matching food
	 * @throws NoSuchFoodException if a matching food could not be found
	 */
	public Food findByUuid_Last(
			String uuid,
			com.liferay.portal.kernel.util.OrderByComparator<Food>
				orderByComparator)
		throws NoSuchFoodException;

	/**
	 * Returns the last food in the ordered set where uuid = &#63;.
	 *
	 * @param uuid the uuid
	 * @param orderByComparator the comparator to order the set by (optionally <code>null</code>)
	 * @return the last matching food, or <code>null</code> if a matching food could not be found
	 */
	public Food fetchByUuid_Last(
		String uuid,
		com.liferay.portal.kernel.util.OrderByComparator<Food>
			orderByComparator);

	/**
	 * Returns the foods before and after the current food in the ordered set where uuid = &#63;.
	 *
	 * @param foodId the primary key of the current food
	 * @param uuid the uuid
	 * @param orderByComparator the comparator to order the set by (optionally <code>null</code>)
	 * @return the previous, current, and next food
	 * @throws NoSuchFoodException if a food with the primary key could not be found
	 */
	public Food[] findByUuid_PrevAndNext(
			long foodId, String uuid,
			com.liferay.portal.kernel.util.OrderByComparator<Food>
				orderByComparator)
		throws NoSuchFoodException;

	/**
	 * Removes all the foods where uuid = &#63; from the database.
	 *
	 * @param uuid the uuid
	 */
	public void removeByUuid(String uuid);

	/**
	 * Returns the number of foods where uuid = &#63;.
	 *
	 * @param uuid the uuid
	 * @return the number of matching foods
	 */
	public int countByUuid(String uuid);

	/**
	 * Returns the food where uuid = &#63; and groupId = &#63; or throws a <code>NoSuchFoodException</code> if it could not be found.
	 *
	 * @param uuid the uuid
	 * @param groupId the group ID
	 * @return the matching food
	 * @throws NoSuchFoodException if a matching food could not be found
	 */
	public Food findByUUID_G(String uuid, long groupId)
		throws NoSuchFoodException;

	/**
	 * Returns the food where uuid = &#63; and groupId = &#63; or returns <code>null</code> if it could not be found. Uses the finder cache.
	 *
	 * @param uuid the uuid
	 * @param groupId the group ID
	 * @return the matching food, or <code>null</code> if a matching food could not be found
	 */
	public Food fetchByUUID_G(String uuid, long groupId);

	/**
	 * Returns the food where uuid = &#63; and groupId = &#63; or returns <code>null</code> if it could not be found, optionally using the finder cache.
	 *
	 * @param uuid the uuid
	 * @param groupId the group ID
	 * @param useFinderCache whether to use the finder cache
	 * @return the matching food, or <code>null</code> if a matching food could not be found
	 */
	public Food fetchByUUID_G(
		String uuid, long groupId, boolean useFinderCache);

	/**
	 * Removes the food where uuid = &#63; and groupId = &#63; from the database.
	 *
	 * @param uuid the uuid
	 * @param groupId the group ID
	 * @return the food that was removed
	 */
	public Food removeByUUID_G(String uuid, long groupId)
		throws NoSuchFoodException;

	/**
	 * Returns the number of foods where uuid = &#63; and groupId = &#63;.
	 *
	 * @param uuid the uuid
	 * @param groupId the group ID
	 * @return the number of matching foods
	 */
	public int countByUUID_G(String uuid, long groupId);

	/**
	 * Returns all the foods where uuid = &#63; and companyId = &#63;.
	 *
	 * @param uuid the uuid
	 * @param companyId the company ID
	 * @return the matching foods
	 */
	public java.util.List<Food> findByUuid_C(String uuid, long companyId);

	/**
	 * Returns a range of all the foods where uuid = &#63; and companyId = &#63;.
	 *
	 * <p>
	 * Useful when paginating results. Returns a maximum of <code>end - start</code> instances. <code>start</code> and <code>end</code> are not primary keys, they are indexes in the result set. Thus, <code>0</code> refers to the first result in the set. Setting both <code>start</code> and <code>end</code> to <code>QueryUtil#ALL_POS</code> will return the full result set. If <code>orderByComparator</code> is specified, then the query will include the given ORDER BY logic. If <code>orderByComparator</code> is absent, then the query will include the default ORDER BY logic from <code>FoodModelImpl</code>.
	 * </p>
	 *
	 * @param uuid the uuid
	 * @param companyId the company ID
	 * @param start the lower bound of the range of foods
	 * @param end the upper bound of the range of foods (not inclusive)
	 * @return the range of matching foods
	 */
	public java.util.List<Food> findByUuid_C(
		String uuid, long companyId, int start, int end);

	/**
	 * Returns an ordered range of all the foods where uuid = &#63; and companyId = &#63;.
	 *
	 * <p>
	 * Useful when paginating results. Returns a maximum of <code>end - start</code> instances. <code>start</code> and <code>end</code> are not primary keys, they are indexes in the result set. Thus, <code>0</code> refers to the first result in the set. Setting both <code>start</code> and <code>end</code> to <code>QueryUtil#ALL_POS</code> will return the full result set. If <code>orderByComparator</code> is specified, then the query will include the given ORDER BY logic. If <code>orderByComparator</code> is absent, then the query will include the default ORDER BY logic from <code>FoodModelImpl</code>.
	 * </p>
	 *
	 * @param uuid the uuid
	 * @param companyId the company ID
	 * @param start the lower bound of the range of foods
	 * @param end the upper bound of the range of foods (not inclusive)
	 * @param orderByComparator the comparator to order the results by (optionally <code>null</code>)
	 * @return the ordered range of matching foods
	 */
	public java.util.List<Food> findByUuid_C(
		String uuid, long companyId, int start, int end,
		com.liferay.portal.kernel.util.OrderByComparator<Food>
			orderByComparator);

	/**
	 * Returns an ordered range of all the foods where uuid = &#63; and companyId = &#63;.
	 *
	 * <p>
	 * Useful when paginating results. Returns a maximum of <code>end - start</code> instances. <code>start</code> and <code>end</code> are not primary keys, they are indexes in the result set. Thus, <code>0</code> refers to the first result in the set. Setting both <code>start</code> and <code>end</code> to <code>QueryUtil#ALL_POS</code> will return the full result set. If <code>orderByComparator</code> is specified, then the query will include the given ORDER BY logic. If <code>orderByComparator</code> is absent, then the query will include the default ORDER BY logic from <code>FoodModelImpl</code>.
	 * </p>
	 *
	 * @param uuid the uuid
	 * @param companyId the company ID
	 * @param start the lower bound of the range of foods
	 * @param end the upper bound of the range of foods (not inclusive)
	 * @param orderByComparator the comparator to order the results by (optionally <code>null</code>)
	 * @param useFinderCache whether to use the finder cache
	 * @return the ordered range of matching foods
	 */
	public java.util.List<Food> findByUuid_C(
		String uuid, long companyId, int start, int end,
		com.liferay.portal.kernel.util.OrderByComparator<Food>
			orderByComparator,
		boolean useFinderCache);

	/**
	 * Returns the first food in the ordered set where uuid = &#63; and companyId = &#63;.
	 *
	 * @param uuid the uuid
	 * @param companyId the company ID
	 * @param orderByComparator the comparator to order the set by (optionally <code>null</code>)
	 * @return the first matching food
	 * @throws NoSuchFoodException if a matching food could not be found
	 */
	public Food findByUuid_C_First(
			String uuid, long companyId,
			com.liferay.portal.kernel.util.OrderByComparator<Food>
				orderByComparator)
		throws NoSuchFoodException;

	/**
	 * Returns the first food in the ordered set where uuid = &#63; and companyId = &#63;.
	 *
	 * @param uuid the uuid
	 * @param companyId the company ID
	 * @param orderByComparator the comparator to order the set by (optionally <code>null</code>)
	 * @return the first matching food, or <code>null</code> if a matching food could not be found
	 */
	public Food fetchByUuid_C_First(
		String uuid, long companyId,
		com.liferay.portal.kernel.util.OrderByComparator<Food>
			orderByComparator);

	/**
	 * Returns the last food in the ordered set where uuid = &#63; and companyId = &#63;.
	 *
	 * @param uuid the uuid
	 * @param companyId the company ID
	 * @param orderByComparator the comparator to order the set by (optionally <code>null</code>)
	 * @return the last matching food
	 * @throws NoSuchFoodException if a matching food could not be found
	 */
	public Food findByUuid_C_Last(
			String uuid, long companyId,
			com.liferay.portal.kernel.util.OrderByComparator<Food>
				orderByComparator)
		throws NoSuchFoodException;

	/**
	 * Returns the last food in the ordered set where uuid = &#63; and companyId = &#63;.
	 *
	 * @param uuid the uuid
	 * @param companyId the company ID
	 * @param orderByComparator the comparator to order the set by (optionally <code>null</code>)
	 * @return the last matching food, or <code>null</code> if a matching food could not be found
	 */
	public Food fetchByUuid_C_Last(
		String uuid, long companyId,
		com.liferay.portal.kernel.util.OrderByComparator<Food>
			orderByComparator);

	/**
	 * Returns the foods before and after the current food in the ordered set where uuid = &#63; and companyId = &#63;.
	 *
	 * @param foodId the primary key of the current food
	 * @param uuid the uuid
	 * @param companyId the company ID
	 * @param orderByComparator the comparator to order the set by (optionally <code>null</code>)
	 * @return the previous, current, and next food
	 * @throws NoSuchFoodException if a food with the primary key could not be found
	 */
	public Food[] findByUuid_C_PrevAndNext(
			long foodId, String uuid, long companyId,
			com.liferay.portal.kernel.util.OrderByComparator<Food>
				orderByComparator)
		throws NoSuchFoodException;

	/**
	 * Removes all the foods where uuid = &#63; and companyId = &#63; from the database.
	 *
	 * @param uuid the uuid
	 * @param companyId the company ID
	 */
	public void removeByUuid_C(String uuid, long companyId);

	/**
	 * Returns the number of foods where uuid = &#63; and companyId = &#63;.
	 *
	 * @param uuid the uuid
	 * @param companyId the company ID
	 * @return the number of matching foods
	 */
	public int countByUuid_C(String uuid, long companyId);

	/**
	 * Returns all the foods where groupId = &#63;.
	 *
	 * @param groupId the group ID
	 * @return the matching foods
	 */
	public java.util.List<Food> findByG_G(long groupId);

	/**
	 * Returns a range of all the foods where groupId = &#63;.
	 *
	 * <p>
	 * Useful when paginating results. Returns a maximum of <code>end - start</code> instances. <code>start</code> and <code>end</code> are not primary keys, they are indexes in the result set. Thus, <code>0</code> refers to the first result in the set. Setting both <code>start</code> and <code>end</code> to <code>QueryUtil#ALL_POS</code> will return the full result set. If <code>orderByComparator</code> is specified, then the query will include the given ORDER BY logic. If <code>orderByComparator</code> is absent, then the query will include the default ORDER BY logic from <code>FoodModelImpl</code>.
	 * </p>
	 *
	 * @param groupId the group ID
	 * @param start the lower bound of the range of foods
	 * @param end the upper bound of the range of foods (not inclusive)
	 * @return the range of matching foods
	 */
	public java.util.List<Food> findByG_G(long groupId, int start, int end);

	/**
	 * Returns an ordered range of all the foods where groupId = &#63;.
	 *
	 * <p>
	 * Useful when paginating results. Returns a maximum of <code>end - start</code> instances. <code>start</code> and <code>end</code> are not primary keys, they are indexes in the result set. Thus, <code>0</code> refers to the first result in the set. Setting both <code>start</code> and <code>end</code> to <code>QueryUtil#ALL_POS</code> will return the full result set. If <code>orderByComparator</code> is specified, then the query will include the given ORDER BY logic. If <code>orderByComparator</code> is absent, then the query will include the default ORDER BY logic from <code>FoodModelImpl</code>.
	 * </p>
	 *
	 * @param groupId the group ID
	 * @param start the lower bound of the range of foods
	 * @param end the upper bound of the range of foods (not inclusive)
	 * @param orderByComparator the comparator to order the results by (optionally <code>null</code>)
	 * @return the ordered range of matching foods
	 */
	public java.util.List<Food> findByG_G(
		long groupId, int start, int end,
		com.liferay.portal.kernel.util.OrderByComparator<Food>
			orderByComparator);

	/**
	 * Returns an ordered range of all the foods where groupId = &#63;.
	 *
	 * <p>
	 * Useful when paginating results. Returns a maximum of <code>end - start</code> instances. <code>start</code> and <code>end</code> are not primary keys, they are indexes in the result set. Thus, <code>0</code> refers to the first result in the set. Setting both <code>start</code> and <code>end</code> to <code>QueryUtil#ALL_POS</code> will return the full result set. If <code>orderByComparator</code> is specified, then the query will include the given ORDER BY logic. If <code>orderByComparator</code> is absent, then the query will include the default ORDER BY logic from <code>FoodModelImpl</code>.
	 * </p>
	 *
	 * @param groupId the group ID
	 * @param start the lower bound of the range of foods
	 * @param end the upper bound of the range of foods (not inclusive)
	 * @param orderByComparator the comparator to order the results by (optionally <code>null</code>)
	 * @param useFinderCache whether to use the finder cache
	 * @return the ordered range of matching foods
	 */
	public java.util.List<Food> findByG_G(
		long groupId, int start, int end,
		com.liferay.portal.kernel.util.OrderByComparator<Food>
			orderByComparator,
		boolean useFinderCache);

	/**
	 * Returns the first food in the ordered set where groupId = &#63;.
	 *
	 * @param groupId the group ID
	 * @param orderByComparator the comparator to order the set by (optionally <code>null</code>)
	 * @return the first matching food
	 * @throws NoSuchFoodException if a matching food could not be found
	 */
	public Food findByG_G_First(
			long groupId,
			com.liferay.portal.kernel.util.OrderByComparator<Food>
				orderByComparator)
		throws NoSuchFoodException;

	/**
	 * Returns the first food in the ordered set where groupId = &#63;.
	 *
	 * @param groupId the group ID
	 * @param orderByComparator the comparator to order the set by (optionally <code>null</code>)
	 * @return the first matching food, or <code>null</code> if a matching food could not be found
	 */
	public Food fetchByG_G_First(
		long groupId,
		com.liferay.portal.kernel.util.OrderByComparator<Food>
			orderByComparator);

	/**
	 * Returns the last food in the ordered set where groupId = &#63;.
	 *
	 * @param groupId the group ID
	 * @param orderByComparator the comparator to order the set by (optionally <code>null</code>)
	 * @return the last matching food
	 * @throws NoSuchFoodException if a matching food could not be found
	 */
	public Food findByG_G_Last(
			long groupId,
			com.liferay.portal.kernel.util.OrderByComparator<Food>
				orderByComparator)
		throws NoSuchFoodException;

	/**
	 * Returns the last food in the ordered set where groupId = &#63;.
	 *
	 * @param groupId the group ID
	 * @param orderByComparator the comparator to order the set by (optionally <code>null</code>)
	 * @return the last matching food, or <code>null</code> if a matching food could not be found
	 */
	public Food fetchByG_G_Last(
		long groupId,
		com.liferay.portal.kernel.util.OrderByComparator<Food>
			orderByComparator);

	/**
	 * Returns the foods before and after the current food in the ordered set where groupId = &#63;.
	 *
	 * @param foodId the primary key of the current food
	 * @param groupId the group ID
	 * @param orderByComparator the comparator to order the set by (optionally <code>null</code>)
	 * @return the previous, current, and next food
	 * @throws NoSuchFoodException if a food with the primary key could not be found
	 */
	public Food[] findByG_G_PrevAndNext(
			long foodId, long groupId,
			com.liferay.portal.kernel.util.OrderByComparator<Food>
				orderByComparator)
		throws NoSuchFoodException;

	/**
	 * Removes all the foods where groupId = &#63; from the database.
	 *
	 * @param groupId the group ID
	 */
	public void removeByG_G(long groupId);

	/**
	 * Returns the number of foods where groupId = &#63;.
	 *
	 * @param groupId the group ID
	 * @return the number of matching foods
	 */
	public int countByG_G(long groupId);

	/**
	 * Caches the food in the entity cache if it is enabled.
	 *
	 * @param food the food
	 */
	public void cacheResult(Food food);

	/**
	 * Caches the foods in the entity cache if it is enabled.
	 *
	 * @param foods the foods
	 */
	public void cacheResult(java.util.List<Food> foods);

	/**
	 * Creates a new food with the primary key. Does not add the food to the database.
	 *
	 * @param foodId the primary key for the new food
	 * @return the new food
	 */
	public Food create(long foodId);

	/**
	 * Removes the food with the primary key from the database. Also notifies the appropriate model listeners.
	 *
	 * @param foodId the primary key of the food
	 * @return the food that was removed
	 * @throws NoSuchFoodException if a food with the primary key could not be found
	 */
	public Food remove(long foodId) throws NoSuchFoodException;

	public Food updateImpl(Food food);

	/**
	 * Returns the food with the primary key or throws a <code>NoSuchFoodException</code> if it could not be found.
	 *
	 * @param foodId the primary key of the food
	 * @return the food
	 * @throws NoSuchFoodException if a food with the primary key could not be found
	 */
	public Food findByPrimaryKey(long foodId) throws NoSuchFoodException;

	/**
	 * Returns the food with the primary key or returns <code>null</code> if it could not be found.
	 *
	 * @param foodId the primary key of the food
	 * @return the food, or <code>null</code> if a food with the primary key could not be found
	 */
	public Food fetchByPrimaryKey(long foodId);

	/**
	 * Returns all the foods.
	 *
	 * @return the foods
	 */
	public java.util.List<Food> findAll();

	/**
	 * Returns a range of all the foods.
	 *
	 * <p>
	 * Useful when paginating results. Returns a maximum of <code>end - start</code> instances. <code>start</code> and <code>end</code> are not primary keys, they are indexes in the result set. Thus, <code>0</code> refers to the first result in the set. Setting both <code>start</code> and <code>end</code> to <code>QueryUtil#ALL_POS</code> will return the full result set. If <code>orderByComparator</code> is specified, then the query will include the given ORDER BY logic. If <code>orderByComparator</code> is absent, then the query will include the default ORDER BY logic from <code>FoodModelImpl</code>.
	 * </p>
	 *
	 * @param start the lower bound of the range of foods
	 * @param end the upper bound of the range of foods (not inclusive)
	 * @return the range of foods
	 */
	public java.util.List<Food> findAll(int start, int end);

	/**
	 * Returns an ordered range of all the foods.
	 *
	 * <p>
	 * Useful when paginating results. Returns a maximum of <code>end - start</code> instances. <code>start</code> and <code>end</code> are not primary keys, they are indexes in the result set. Thus, <code>0</code> refers to the first result in the set. Setting both <code>start</code> and <code>end</code> to <code>QueryUtil#ALL_POS</code> will return the full result set. If <code>orderByComparator</code> is specified, then the query will include the given ORDER BY logic. If <code>orderByComparator</code> is absent, then the query will include the default ORDER BY logic from <code>FoodModelImpl</code>.
	 * </p>
	 *
	 * @param start the lower bound of the range of foods
	 * @param end the upper bound of the range of foods (not inclusive)
	 * @param orderByComparator the comparator to order the results by (optionally <code>null</code>)
	 * @return the ordered range of foods
	 */
	public java.util.List<Food> findAll(
		int start, int end,
		com.liferay.portal.kernel.util.OrderByComparator<Food>
			orderByComparator);

	/**
	 * Returns an ordered range of all the foods.
	 *
	 * <p>
	 * Useful when paginating results. Returns a maximum of <code>end - start</code> instances. <code>start</code> and <code>end</code> are not primary keys, they are indexes in the result set. Thus, <code>0</code> refers to the first result in the set. Setting both <code>start</code> and <code>end</code> to <code>QueryUtil#ALL_POS</code> will return the full result set. If <code>orderByComparator</code> is specified, then the query will include the given ORDER BY logic. If <code>orderByComparator</code> is absent, then the query will include the default ORDER BY logic from <code>FoodModelImpl</code>.
	 * </p>
	 *
	 * @param start the lower bound of the range of foods
	 * @param end the upper bound of the range of foods (not inclusive)
	 * @param orderByComparator the comparator to order the results by (optionally <code>null</code>)
	 * @param useFinderCache whether to use the finder cache
	 * @return the ordered range of foods
	 */
	public java.util.List<Food> findAll(
		int start, int end,
		com.liferay.portal.kernel.util.OrderByComparator<Food>
			orderByComparator,
		boolean useFinderCache);

	/**
	 * Removes all the foods from the database.
	 */
	public void removeAll();

	/**
	 * Returns the number of foods.
	 *
	 * @return the number of foods
	 */
	public int countAll();

}