# HTML to ACF JSON Generation Guide

## Overview

This guide outlines the process and rules for converting HTML structures into Advanced Custom Fields (ACF) JSON format.

Step 1: Generate Complete ACF JSON

Analyze entire HTML document
Create comprehensive ACF JSON structure for all sections
Include all fields needed for the entire page
Do not implement or output values yet
After will ask me want next step 2

Step 2: Implement HTML Output (Done Later)
DON'T say anything only need generate code and name file will put in code don't say anything else bla bla except say next step.
After JSON is complete and approved
You will output the ACF values in HTML structure
Maintain original HTML structure, Extremely careful don't change class or structure only output values on it

format will like this:

```php
// File page-about.php
<?php /*
Template name: Page - About
*/ ?>
<?= get_header() ?>
<?php get_template_part('modules/common/breadcrumb')?>
<?php
if (have_rows('about_sections')) :
	while (have_rows('about_sections')) : the_row();
		$layout = get_row_layout();
		get_template_part('modules/about/about-' . get_row_layout());
	endwhile;
endif;
?>
<?= get_footer() ?>

```

All file section will put in folder modules/<name_folder>/<name_file.php>
Noted that say name file of section on top.

```php
// File modules/about/about-about_1.php
<?php
$title = get_sub_field('title');
$description = get_sub_field('description');
$image = get_sub_field('image');
$statistics = get_sub_field('statistics');
?>
...HTML of section
```

## General Rules

ALWAYS use flexible content wrap for all field group
Don't use esc_html

1. **Field Group Structure**
    - Always start with a main field group
    - Use flexible content as the primary container
    - Name the flexible content field "[page_name]\_sections"

```json
{
	"key": "group_[page_name]",
	"title": "[Page Name]",
	"fields": [
		{
			"key": "field_[page_name]_flexible_content",
			"label": "[Page Name] Sections",
			"name": "[page_name]_sections",
			"type": "flexible_content",
			"layouts": {}
		}
	]
}
```

2. **Naming Conventions**

    - Field keys: "field*[section_name]*[field_name]"
    - Layout keys: "layout\_[section_name]"
    - Field names: Use lowercase with underscores

3. **Field Types**
    - Use wysiwyg instead of textarea
    - Use repeater for recurring elements
    - Use image fields for img tags
    - Use link fields for anchor tags with both text and URL

## HTML Analysis Process

1. **Section Identification**

    - Identify distinct sections in HTML (usually marked by <section> tags)
    - Create a layout in flexible content for each section

2. **Field Mapping**

    - Map HTML elements to appropriate ACF fields:
        - <h1>, <h2>, etc. → text fields
        - <p> → wysiwyg fields
        - <img> → image fields
        - <a> → link fields
        - Repeating structures → repeater fields

3. **Nested Structures**

    - Use groups for complex nested structures
    - Use repeaters for recurring nested structures

4. Always keep code html don't change class or structure only output values on it
   ACF JSON Structure:

```json
{
	"layout_example_section": {
		"key": "layout_example_section",
		"name": "example_section",
		"label": "Example Section",
		"sub_fields": [
			{
				"key": "field_example_title",
				"label": "Title",
				"name": "title",
				"type": "text"
			},
			{
				"key": "field_example_description",
				"label": "Description",
				"name": "description",
				"type": "wysiwyg"
			},
			{
				"key": "field_example_items",
				"label": "Items",
				"name": "items",
				"type": "repeater",
				"sub_fields": [
					{
						"key": "field_example_item_image",
						"label": "Item Image",
						"name": "item_image",
						"type": "image"
					},
					{
						"key": "field_example_item_title",
						"label": "Item Title",
						"name": "item_title",
						"type": "text"
					},
					{
						"key": "field_example_item_description",
						"label": "Item Description",
						"name": "item_description",
						"type": "wysiwyg"
					}
				]
			}
		]
	}
}
```

## Special Considerations

1. **Sliders/Carousels**

    - Always use repeaters for slider content
    - Include options for navigation if present

2. **Background Images**

    - If a section uses a background image, add an image field

3. **Buttons/Links**
    - Use link fields instead of separate text and URL fields
4. **Images**
    - Use util function get_image_attrachment($image, $type = "image") to get image
    - Use util function get_image_post($id, $type = "image") to get image

## Output Format

```json
{
	"key": "group_[unique_identifier]",
	"title": "[Field Group Title]",
	"fields": [
		{
			"key": "field_[unique_identifier]",
			"label": "[Field Label]",
			"name": "[field_name]",
			"type": "flexible_content",
			"layouts": {
				"[layout_key]": {
					"key": "layout_[unique_identifier]",
					"name": "[layout_name]",
					"label": "[Layout Label]",
					"display": "block",
					"sub_fields": []
				}
			}
		}
	],
	"location": [
		[
			{
				"param": "page_template",
				"operator": "==",
				"value": "template-[page_name].php"
			}
		]
	],
	"menu_order": 0,
	"position": "normal",
	"style": "default",
	"label_placement": "top",
	"instruction_placement": "label",
	"hide_on_screen": "",
	"active": true,
	"description": ""
}
```

# Utils Function

```php
function get_image_attrachment($image, $type = "image")
{
	if ($type == "image") {
		if (!empty($image['ID'])) {
			$url = wp_get_attachment_image($image['ID'], 'full', '', array('class' => ''));
			return changeAttrImage($url);
		} else {
			$url = wp_get_attachment_image($image, 'full', '', array('class' => ''));
			return changeAttrImage($url);
		}
	}
	if ($type == "url") {
		if (!empty($image['ID'])) {
			$url = wp_get_attachment_image_url($image['ID'], 'full', '', array('class' => ''));
			return $url;
		} else {
			$url = wp_get_attachment_image_url($image, 'full', '', array('class' => ''));
			return $url;
		}
	}
}

function get_image_post($id, $type = "image")
{
	if ($type == "image") {
		$url = get_the_post_thumbnail($id, 'full', '', array('class' => ''));
		return changeAttrImage($url);
	}
	if ($type == "url") {
		$url = get_the_post_thumbnail_url($id, 'full', '', array('class' => ''));
		return $url;
	}
}
```

# Rules for form

-   If is input or all field related form then will use format input of contact form 7 like below

```html
<div class="wrap-form">
	<div class="form-group">
		<input
			type="text"
			placeholder="Họ và tên *"
		/>
	</div>
	<div class="form-group">
		<input
			type="email"
			placeholder="Email *"
		/>
	</div>
	<div class="form-group">
		<input
			type="tel"
			placeholder="Số điện thoại *"
		/>
	</div>
	<div class="form-group">
		<input
			type="text"
			placeholder="Tiêu đề"
		/>
	</div>
	<div class="form-group col-span-2">
		<textarea placeholder="Nội dung"> </textarea>
	</div>
	<div class="frm-btnwrap">
		<button class="btn btn-primary"><span>GỬI</span><em class="fa-solid fa-chevron-right"></em></button>
	</div>
</div>
```

Ouput html with contact form 7 like below

```php
<div class="wrap-form">
	<div class="form-group">
		[text* ho-va-ten placeholder "Họ và tên"]
	</div>
	<div class="form-group">
		[email* email placeholder "Email"]
	</div>
	<div class="form-group">
		[tel* so-dien-thoai placeholder "Số điện thoại"]
	</div>
	<div class="form-group">
		[text* title placeholder "Tiêu đề"]
	</div>
	<div class="form-group">
		[textarea noi-dung placeholder "Nội dung"]
	</div>
	<div class="frm-btnwrap">
		<button class="btn btn-primary"><span>GỬI</span><em class="fa-solid fa-chevron-right"></em></button>
	</div>
</div>
```
