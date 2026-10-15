---
title: "Gravity doesn't matter for joint PID tuning"
description: "Posture changes the gravity torque on a humanoid shoulder by 16 N·m and the stability margin by 0.018°. Here is why that is exact rather than approximate — and the one place gravity does bite."
pubDate: 2026-10-14
series: equations-to-encoders
tags: ["control", "system identification", "robotics"]
draft: false
---

A placeholder, here to prove the pipeline works end to end: frontmatter, series
filing, KaTeX, and code highlighting.

## The claim

A robot joint under a PD loop sees gravity in two distinct ways, and they are
**ninety degrees out of phase** with each other. Hanging straight down there is
no gravity torque but maximum gravitational stiffness; held horizontally it is
the reverse.

The plant is

$$
P(s) = \frac{\Delta\theta}{\Delta\tau} = \frac{1}{Js^2 + bs + k_g},
\qquad k_g \equiv \frac{\partial g}{\partial \theta}
$$

The constant torque $\tau_g$ never appears in $P(s)$ at all. It shifts the
operating point and nothing else, so

$$
\frac{\partial(\text{any stability margin})}{\partial \tau_g} \equiv 0
$$

exactly, by linearity. Not approximately. Exactly.

## Where $k_g$ goes

The stiffness term does survive, but only through a single dimensionless group:

$$
\varepsilon \equiv \left(\frac{\omega_g}{\omega_c}\right)^2,
\qquad \omega_g = \sqrt{\frac{|k_g|}{J}}
$$

and $\omega_g$ is bounded by geometry alone. Because $J \ge m\ell^2$ by the
parallel axis theorem while $|k_g|_{\max} = mg\ell$, the mass cancels:

$$
\omega_g \le \sqrt{g/\ell}
$$

For a human-scale limb this caps the gravity corner near 1 Hz regardless of how
heavy the arm is.

## Code renders too

```python
import numpy as np

def gravity_corner_hz(k_g: float, inertia: float) -> float:
    """Gravity corner frequency in Hz, the only place gravity enters tuning."""
    return np.sqrt(abs(k_g) / inertia) / (2 * np.pi)
```

> Replace this file with the real article. Omitting `draft` entirely marks a
> post as a draft — publishing is opt-in, so nothing ships by accident.
