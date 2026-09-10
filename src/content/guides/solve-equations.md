---
title: "How to solve equations with Sumi's SOLVE"
description: 'Use numerical SOLVE to find X, enter an initial estimate, read the L−R residual and try another root, with a worked X² = 2 example.'
publishedDate: 2026-09-10
order: 3
readTime: '4 min read'
---

Sumi's **SOLVE** finds a numerical value of **X** that satisfies an equation. You enter the equation and a starting estimate; the result shows **X** and the difference between the equation's left and right sides, labelled **L−R**.

It searches from your estimate using Newton's method. The starting point matters: an equation may have several roots, and one run does not list them all. This guide uses **X² = 2** to show the controls and how to find its positive and negative roots.

## Find the three SOLVE controls

Open Settings with the sliders icon near the top of the keypad and turn on **Key legends** to show the SHIFT and ALPHA functions. Choose **Number format → Norm1** to match the values below.

| To enter or start                  | Tap these keys in order  |
| ---------------------------------- | ------------------------ |
| The variable X                     | **ALPHA**, then **)**    |
| An equals sign inside the equation | **ALPHA**, then **CALC** |
| SOLVE                              | **SHIFT**, then **CALC** |

Each modifier applies to the next key. The equation's equals sign is entered with **ALPHA CALC**. The ordinary **=** key accepts a value at a prompt or evaluates a calculation.

## Solve X² = 2

1. Tap **AC** to start a new expression.
2. Tap **ALPHA**, **)**, then **x²** to enter **X²**.
3. Tap **ALPHA**, **CALC**, then **2** to complete **X² = 2**.
4. Tap **SHIFT**, then **CALC** to open SOLVE.
5. At the **X?** prompt, enter **1** as the starting estimate.
6. Tap the ordinary **=** key.

The result is **X = 1.414213562**, with **L−R = 0**. This is the numerical approximation to the positive square root of two. SOLVE displays decimal results; entering **√2** as an ordinary calculation is the way to obtain the exact root form.

The value already shown at **X?** is the current stored value of X. Pressing **=** without entering anything accepts it. Enter **1** explicitly for this example: starting at zero can fail because the slope of **X² − 2** is zero there.

## Try the other root

From the completed solution screen, tap **=** to solve again. At **X?**, tap **(−)**, **1**, **=**. Use the negative-sign key labelled **(−)**.

Starting at **−1** gives **X = −1.414213562**, again with **L−R = 0**. These two starting estimates reach the two roots of this particular equation. Trying several estimates is useful, but it does not establish that every root of an arbitrary equation has been found.

Tap **AC** to leave SOLVE and return to the equation for editing.

## Read the residual and handle other equations

**L−R** is the left side minus the right side evaluated at the computed solution. A value close to zero indicates that the two sides agree closely in the numerical calculation. A displayed zero is not a proof of an exact algebraic answer: calculation and display precision are finite.

You may omit the equation's equals sign when the right side is zero. Enter **2 × X − 6**, start SOLVE and use **1** at **X?**; the result is **X = 3**.

If your equation contains other variables, Sumi prompts for their values before the initial X. SOLVE still searches for **X**, so an expression containing no X gives **Variable ERROR**. For trigonometric equations, check **Settings → Angle unit** before solving.

**Can't Solve** can mean the starting estimate led to a flat slope, an undefined value or another numerical failure. Check the equation and try a suitable different estimate; the message alone does not prove that no solution exists. If **Continue: =** appears, press **=** to continue the numerical search, or **AC** to leave.
