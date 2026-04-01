export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type UserRole = 'subscriber' | 'admin'
export type SubscriptionStatus = 'active' | 'cancelled' | 'lapsed'
export type SubscriptionPlan = 'monthly' | 'yearly'
export type DrawStatus = 'draft' | 'simulated' | 'published'
export type DrawLogic = 'random' | 'weighted'
export type DrawTier = '5match' | '4match' | '3match' | 'none'
export type VerificationStatus = 'pending' | 'approved' | 'rejected'
export type PayoutStatus = 'pending' | 'paid'
export type ContributionSource = 'subscription' | 'voluntary'
export type DonationStatus = 'pending' | 'succeeded' | 'failed'

export interface Database {
    public: {
        Tables: {
            users: {
                Row: {
                    id: string
                    email: string
                    full_name: string | null
                    role: UserRole
                    avatar_url: string | null
                    created_at: string
                }
                Insert: {
                    id: string
                    email: string
                    full_name?: string | null
                    role?: UserRole
                    avatar_url?: string | null
                    created_at?: string
                }
                Update: {
                    full_name?: string | null
                    role?: UserRole
                    avatar_url?: string | null
                }
            }
            subscriptions: {
                Row: {
                    id: string
                    user_id: string
                    stripe_subscription_id: string | null
                    stripe_customer_id: string | null
                    plan: SubscriptionPlan
                    status: SubscriptionStatus
                    current_period_end: string | null
                    charity_id: string | null
                    charity_percentage: number
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    stripe_subscription_id?: string | null
                    stripe_customer_id?: string | null
                    plan: SubscriptionPlan
                    status?: SubscriptionStatus
                    current_period_end?: string | null
                    charity_id?: string | null
                    charity_percentage?: number
                    created_at?: string
                }
                Update: {
                    stripe_subscription_id?: string | null
                    stripe_customer_id?: string | null
                    plan?: SubscriptionPlan
                    status?: SubscriptionStatus
                    current_period_end?: string | null
                    charity_id?: string | null
                    charity_percentage?: number
                }
            }
            scores: {
                Row: {
                    id: string
                    user_id: string
                    stableford_score: number
                    played_at: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    stableford_score: number
                    played_at: string
                    created_at?: string
                }
                Update: {
                    stableford_score?: number
                    played_at?: string
                }
            }
            charities: {
                Row: {
                    id: string
                    name: string
                    slug: string
                    description: string | null
                    logo_url: string | null
                    images: Json
                    events: Json
                    is_featured: boolean
                    is_active: boolean
                    created_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    slug: string
                    description?: string | null
                    logo_url?: string | null
                    images?: Json
                    events?: Json
                    is_featured?: boolean
                    is_active?: boolean
                    created_at?: string
                }
                Update: {
                    name?: string
                    description?: string | null
                    logo_url?: string | null
                    images?: Json
                    events?: Json
                    is_featured?: boolean
                    is_active?: boolean
                }
            }
            charity_contributions: {
                Row: {
                    id: string
                    user_id: string
                    charity_id: string
                    amount: number
                    period: string
                    source: ContributionSource
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    charity_id: string
                    amount: number
                    period: string
                    source: ContributionSource
                    created_at?: string
                }
                Update: never
            }
            platform_config: {
                Row: {
                    key: string
                    value: string
                    updated_at: string
                }
                Insert: {
                    key: string
                    value: string
                    updated_at?: string
                }
                Update: {
                    value?: string
                    updated_at?: string
                }
            }
            draws: {
                Row: {
                    id: string
                    month: string
                    status: DrawStatus
                    draw_numbers: number[] | null
                    logic_type: DrawLogic
                    jackpot_carried_forward: boolean
                    jackpot_amount: number
                    created_at: string
                    published_at: string | null
                }
                Insert: {
                    id?: string
                    month: string
                    status?: DrawStatus
                    draw_numbers?: number[] | null
                    logic_type?: DrawLogic
                    jackpot_carried_forward?: boolean
                    jackpot_amount?: number
                    created_at?: string
                    published_at?: string | null
                }
                Update: {
                    status?: DrawStatus
                    draw_numbers?: number[] | null
                    logic_type?: DrawLogic
                    jackpot_carried_forward?: boolean
                    jackpot_amount?: number
                    published_at?: string | null
                }
            }
            draw_entries: {
                Row: {
                    id: string
                    draw_id: string
                    user_id: string
                    matched_count: number
                    tier: DrawTier
                }
                Insert: {
                    id?: string
                    draw_id: string
                    user_id: string
                    matched_count: number
                    tier: DrawTier
                }
                Update: never
            }
            prize_pools: {
                Row: {
                    id: string
                    draw_id: string
                    total_pool: number
                    five_match_pool: number
                    four_match_pool: number
                    three_match_pool: number
                    jackpot_rollover_amount: number
                }
                Insert: {
                    id?: string
                    draw_id: string
                    total_pool: number
                    five_match_pool: number
                    four_match_pool: number
                    three_match_pool: number
                    jackpot_rollover_amount?: number
                }
                Update: never
            }
            draw_simulations: {
                Row: {
                    id: string
                    draw_id: string
                    simulated_at: string
                    result_snapshot: Json
                }
                Insert: {
                    id?: string
                    draw_id: string
                    simulated_at?: string
                    result_snapshot: Json
                }
                Update: never
            }
            winners: {
                Row: {
                    id: string
                    draw_id: string
                    user_id: string
                    tier: DrawTier
                    prize_amount: number
                    proof_url: string | null
                    verification_status: VerificationStatus
                    payout_status: PayoutStatus
                    admin_notes: string | null
                    verified_at: string | null
                    paid_at: string | null
                }
                Insert: {
                    id?: string
                    draw_id: string
                    user_id: string
                    tier: DrawTier
                    prize_amount: number
                    proof_url?: string | null
                    verification_status?: VerificationStatus
                    payout_status?: PayoutStatus
                    admin_notes?: string | null
                    verified_at?: string | null
                    paid_at?: string | null
                }
                Update: {
                    proof_url?: string | null
                    verification_status?: VerificationStatus
                    payout_status?: PayoutStatus
                    admin_notes?: string | null
                    verified_at?: string | null
                    paid_at?: string | null
                }
            }
            donations: {
                Row: {
                    id: string
                    user_id: string
                    charity_id: string
                    amount: number
                    stripe_payment_intent_id: string | null
                    status: DonationStatus
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    charity_id: string
                    amount: number
                    stripe_payment_intent_id?: string | null
                    status?: DonationStatus
                    created_at?: string
                }
                Update: {
                    stripe_payment_intent_id?: string | null
                    status?: DonationStatus
                }
            }
        }
        Views: Record<string, never>
        Functions: Record<string, never>
        Enums: Record<string, never>
    }
}
