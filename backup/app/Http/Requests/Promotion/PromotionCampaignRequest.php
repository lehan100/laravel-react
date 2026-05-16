<?php

namespace App\Http\Requests\Promotion;

use App\Models\Promotion\PromotionCampaign;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class PromotionCampaignRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'is_active' => filter_var($this->input('is_active', false), FILTER_VALIDATE_BOOLEAN),
        ]);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $campaignId = $this->route('promotion_campaign');
        if (is_object($campaignId)) {
            $campaignId = $campaignId->id ?? null;
        }

        $translations = $this->input('translations', []);
        $translationRules = [
            'translations' => ['required', 'array'],
            'translations.*' => ['required', 'array'],
            'translations.*.name' => ['required', 'string', 'max:255'],
            'translations.*.description' => ['nullable', 'string'],
            'translations.*.slug' => [
                'required',
                'string',
                'max:255',
            ],
        ];

        foreach (array_keys(is_array($translations) ? $translations : []) as $locale) {
            $uniqueSlugRule = Rule::unique('slugs', 'slug')
                ->where(fn ($query) => $query
                    ->where('locale', $locale)
                    ->where('sluggable_type', PromotionCampaign::class)
                    ->where('is_default', true)
                    ->whereNull('redirect_to'));

            if ($campaignId !== null) {
                $uniqueSlugRule = $uniqueSlugRule->ignore($campaignId, 'sluggable_id');
            }

            $translationRules["translations.{$locale}.slug"][] = $uniqueSlugRule;
        }

        return array_merge($translationRules, [
            'description' => ['nullable', 'string'],
            'starts_at' => ['nullable', 'date'],
            'ends_at' => ['required', 'date', 'after:now', 'after_or_equal:starts_at'],
            'priority' => ['nullable', 'integer', 'min:0'],
            'product_ids' => ['nullable', 'array'],
            'product_ids.*' => ['integer', 'exists:products,id'],
            'coupon_ids' => ['nullable', 'array'],
            'coupon_ids.*' => ['integer', 'exists:promotion_coupons,id'],
            'saleoffer_ids' => ['nullable', 'array'],
            'saleoffer_ids.*' => ['integer', 'exists:promotion_saleoffers,id'],
            'buytogift_ids' => ['nullable', 'array'],
            'buytogift_ids.*' => ['integer', 'exists:promotion_buytogift_offers,id'],
            'sync_module_ends_at' => ['nullable', 'boolean'],
            'is_active' => ['boolean'],
            'undo' => ['nullable', 'integer', Rule::in([0, 1])],
        ]);
    }
}
