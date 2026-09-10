---
title: 'How to get exact answers in Sumi'
description: "Keep calculator answers as fractions, surds and multiples of π. Learn Sumi's exact-answer controls, angle settings and decimal display limits."
publishedDate: 2026-09-10
order: 2
readTime: '4 min read'
---

An exact answer preserves a value without rounding it. **1/3**, **√2** and **π/6** describe values precisely; their decimal displays have a limited number of digits. Sumi can keep supported calculations as reduced fractions, simplified surds and rational multiples of π.

A surd is an irrational root left in root form. For example, **√8** simplifies to **2√2**. This guide shows how to enter these calculations, reveal their decimal values and recognise when a decimal answer is expected.

## Start with a square root

Tap **AC**, **√**, **8**, **→**, **=**. Here **→** is the right arrow on the directional pad, which moves the cursor out of the root. Sumi returns **2√2**.

Tap **S⇔D** to see its decimal value, then tap the same key again to restore the surd. This changes the displayed form of the result.

For another example, enter **1 ÷ √2** by tapping **AC**, **1**, **÷**, **√**, **2**, **→**, **=**. The exact result is **√2/2**. The denominator has been rationalised automatically.

Use the square-root key when you want a square root. Although **2^0.5** represents the same mathematical value as **√2**, Sumi evaluates the fractional-power expression to a decimal. The form you enter can affect whether the calculation retains an exact result.

## Get an exact trigonometric answer

Angle units change the meaning of a trigonometric input. Before trying this example, open Settings with the sliders icon near the top of the keypad and choose **Angle unit → Deg**. Also choose **Number format → Norm1** to match the decimal below.

Tap **AC**, **sin**, **1**, **5**, **)**, **=**. For **sin(15°)**, Sumi shows **(√6 − √2)/4**.

Tap **S⇔D** to display **0.2588190451**. Tap it again to return to the exact surd. Other supported degree examples include **sin(30°) = 1/2** and **sin(45°) = √2/2**.

Use **Angle unit → Rad** for calculations written in radians. Keep π in the input when the angle is a multiple of π: typing a rounded decimal approximation changes the value being calculated.

## Enter π without rounding it

The π function is on **SHIFT**, then **×10ˣ**. To calculate **π/6**, tap **AC**, **SHIFT**, **×10ˣ**, **÷**, **6**, **=**.

Sumi displays **1/6 π**, meaning one sixth multiplied by π. Tap **S⇔D** to see **0.5235987756** in Norm1, then tap it again to restore the π form.

Use the ordinary **=** key for these examples. **SHIFT**, then **=** selects approximate evaluation. In particular, a π result evaluated that way will stay decimal when you tap **S⇔D**.

## Understand decimal results

Exact output covers supported forms, so a decimal answer is sometimes expected. For example, **π + 1**, **√2 × π** and **√2 + √3 + √5** produce decimals. Large fractions can also exceed the fraction display limit. **S⇔D** cannot create an exact form that the calculation does not support.

For a chosen number of decimal places, open **Settings → Number format → Fix** and adjust **Decimal places**. Then use **S⇔D** if the result is currently exact. With three decimal places selected, the decimal display of **1/3** is **0.333**. The display setting controls presentation; it does not make a rounded decimal equal to the original exact value.
