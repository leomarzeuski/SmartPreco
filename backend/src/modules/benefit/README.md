# Benefits Module

This module manages benefits (vouchers, discounts, gifts, etc.) that can be assigned to users by administrators.

## Overview

The Benefits module provides functionality for:

- Creating and managing benefits (admin only)
- Assigning benefits to users with SMS notifications
- Users claiming assigned benefits
- Consuming/validating benefits via codes

## Database Schema

### Benefits Table

- `id` (UUID) - Primary key
- `market_id` (UUID) - Foreign key to markets table
- `type` (ENUM) - VOUCHER, GIFT, DISCOUNT, CASHBACK, FREEBIE
- `name` (TEXT) - Benefit name
- `description` (TEXT) - Benefit description
- `valid_from` (TIMESTAMP) - When benefit becomes valid
- `valid_to` (TIMESTAMP) - When benefit expires
- `image_url` (TEXT) - Optional image URL
- `created_at` (TIMESTAMP) - Creation timestamp
- `updated_at` (TIMESTAMP) - Update timestamp

### User Benefits Table

- `id` (UUID) - Primary key
- `user_id` (UUID) - Foreign key to users
- `benefit_id` (UUID) - Foreign key to benefits table
- `status` (ENUM) - ASSIGNED, CLAIMED, CONSUMED
- `code` (TEXT) - 8-character ULID validation code (nullable, unique)
- `assigned_at` (TIMESTAMP) - When benefit was assigned
- `claimed_at` (TIMESTAMP) - When benefit was claimed
- `consumed_at` (TIMESTAMP) - When benefit was consumed

## API Endpoints

### Benefits Management (Admin Only)

#### POST `/benefits`

Creates a new benefit

- **Auth**: Admin only
- **Body**: BenefitCreateDto

#### GET `/benefits`

Retrieves benefits

- **Auth**: User (behavior differs by role)
- **Admin**: Returns all benefits
- **User**: Returns user's assigned/claimed benefits only
- **Query**: BenefitReadDto (search, type, marketId, activeOnly, pagination)

#### GET `/benefits/:benefitId`

Retrieves a specific benefit

- **Auth**: User
- **Params**: benefitId (UUID)

#### PATCH `/benefits/:benefitId`

Updates a benefit

- **Auth**: Admin only
- **Params**: benefitId (UUID)
- **Body**: BenefitUpdateDto

#### DELETE `/benefits/:benefitId`

Deletes a benefit

- **Auth**: Admin only
- **Params**: benefitId (UUID)

### Benefit Assignment (Admin Only)

#### POST `/benefits/:benefitId/assign`

Assigns benefit to users and sends SMS notifications

- **Auth**: Admin only
- **Params**: benefitId (UUID)
- **Body**: BenefitAssignDto (userIds array)

### User Benefit Operations

#### GET `/benefits/user/my-benefits`

Gets current user's benefits

- **Auth**: User
- **Query**: UserBenefitReadDto (status, activeAndClaimedOnly, pagination)

#### POST `/benefits/:benefitId/claim`

Claims a benefit for current user

- **Auth**: User
- **Params**: benefitId (UUID)
- **Returns**: BenefitClaimResponseDto (code, claimedAt)

### Benefit Consumption (Admin Only)

#### POST `/benefits/consume`

Consumes a claimed benefit

- **Auth**: Admin only
- **Body**: UserBenefitConsumeDto (userId, code)
- **Returns**: BenefitConsumeResponseDto

## Workflow

1. **Admin creates benefit** → Benefit is created for a specific market
2. **Admin assigns benefit** → User-benefit relationships created, SMS sent
3. **User claims benefit** → Status changes to CLAIMED, 8-char code generated
4. **Admin consumes benefit** → Status changes to CONSUMED (at point of sale)

## Status Flow

```
ASSIGNED → CLAIMED → CONSUMED
```

- **ASSIGNED**: Benefit assigned to user but not yet claimed
- **CLAIMED**: User has claimed the benefit and received validation code
- **CONSUMED**: Admin has validated and consumed the benefit

## Features

- **Role-based access**: Admins manage benefits, users can only claim/view theirs
- **Validation codes**: 8-character ULID codes for secure benefit consumption
- **Date validation**: Benefits can only be claimed/consumed within valid date range
- **SMS notifications**: Placeholder for SMS integration when benefits are assigned
- **Comprehensive filtering**: Search, type, market, active status filters
- **Pagination**: All list endpoints support pagination
- **Status tracking**: Full audit trail with timestamps for each status change

## Future Enhancements

- SMS integration for user notifications
- Advanced assignment rules based on user attributes
- Benefit usage analytics
- Integration with loyalty programs
- QR code generation for validation codes
