export type MC = {
  id: string;
  page: number;
  question: string;
  figure?: string;
  options: string[];
  answer: number;
  explanation: string;
};

export type FR = {
  id: string;
  page: number;
  title: string;
  prompt: string;
  figure?: string;
  hint: string;
  solution: string;
  answer: string;
};

export type Exam = { id: string; title: string; pdf: string; mc: MC[]; fr: FR[] };

const r = String.raw;

export const EXAMS: Exam[] = [
  {
    id: "v4",
    title: "Practice Exam 2 · Version 4",
    pdf: "/exams/EP2_Exam2_2026_v4.pdf",
    mc: [
      {
        id: "v4-mc1",
        page: 2,
        question: "A negative charge, if free, will tend to move",
        options: [
          "from high potential to low potential.",
          "from low potential to high potential.",
          "away from infinity.",
          "toward infinity.",
          "in the direction of the electric field.",
        ],
        answer: 1,
        explanation: r`$U = qV$ with $q<0$: to lower $U$ the charge must go to **higher** $V$. Balloon, not ball. 🎈 (That is also *opposite* to $\vec E$, which rules out E.)`,
      },
      {
        id: "v4-mc2",
        page: 2,
        question: "If you stretch a copper wire so that it is thinner, the resistance between its ends",
        options: ["remains unchanged.", "decreases.", "increases.", "decreases at first, but then increases if you take it even thinner."],
        answer: 2,
        explanation: r`Volume $LA$ is fixed, so stretching makes $L$ bigger **and** $A$ smaller. Both raise $R = \rho L/A$ (stretch by a factor $s$ → $R \to s^2R$).`,
      },
      {
        id: "v4-mc3",
        page: 2,
        question: "The force on an electron moving in a magnetic field will be least when its velocity is",
        options: ["perpendicular to the magnetic field direction.", "the same as the magnetic field direction.", "either of these", "neither of these"],
        answer: 1,
        explanation: r`$|F| = |q|vB\sin\theta$. Parallel ($\theta = 0$) gives $\sin\theta = 0$: zero force, the least possible.`,
      },
      {
        id: "v4-mc4",
        page: 2,
        question: "All resistors are identical. Which circuit has the smallest equivalent resistance?",
        figure:
          "(a) two parallel pairs (1∥2) in series with (3∥4). (b) one parallel pair (1∥2) in series with 3 and 4. (c) all four in series.",
        options: ["a", "b", "c", "All the circuits have equal equivalent resistance."],
        answer: 0,
        explanation: r`(a) $\tfrac R2 + \tfrac R2 = R$. (b) $\tfrac R2 + 2R = 2.5R$. (c) $4R$. More parallel paths → less resistance, so **(a)**.`,
      },
      {
        id: "v4-mc5",
        page: 3,
        question:
          "The figure shows equipotential lines surrounding a negative charge. What is the direction of the electric field in the region where the field has the highest magnitude?",
        figure: "Nested, lopsided equipotential loops. The charge sits near the right side, where the loops are squeezed closest together.",
        options: ["to the right", "upward", "downward", "to the left"],
        answer: 3,
        explanation: r`Strongest field = lines closest together = just to the **right** of the charge. $\vec E$ points toward a negative charge, and from that region "toward the charge" is **to the left**.`,
      },
      {
        id: "v4-mc6",
        page: 3,
        question:
          "Each of wires 1–3 carries a current perpendicular to the page. The line integrals of B around the three Amperian paths shown all have the same negative value. Which wires carry current into the page?",
        figure:
          "Small loop around wire 1: arrow at the bottom points right (counterclockwise). Small loop around wire 2: arrow at the bottom points left (clockwise). Big loop around all three: arrow at the bottom points right (counterclockwise).",
        options: ["Wire 1", "Wire 2", "Wire 3", "Wires 1 and 2", "Wires 2 and 3", "Wires 1 and 3", "all three wires"],
        answer: 5,
        explanation: r`Call the common value $-\mu_0 I_0$ and count **out of page = +** for counterclockwise loops.
Loop 1 (CCW): $I_1 = -I_0$ → **into**.
Loop 2 (CW, so into counts +): $-I_2 = -I_0$ → $I_2 = +I_0$ → **out**.
Big loop (CCW): $I_1 + I_2 + I_3 = -I_0$ → $-I_0 + I_0 + I_3 = -I_0$ → $I_3 = -I_0$ → **into**.
So wires **1 and 3**.`,
      },
    ],
    fr: [
      {
        id: "v4-q1",
        page: 4,
        title: "Q1 · Power used by a two-battery circuit",
        prompt: r`Three branches connect a left node and a right node: **top** = battery $\varepsilon$ in series with $2R$; **middle** = $R$ alone; **bottom** = battery $\varepsilon$ in series with $R$. How much power does the circuit use? Answer in terms of $\varepsilon$ and $R$.`,
        figure: "Both batteries are drawn with the same orientation, so they push current the same way around the outside.",
        hint: "All three branches share the same two nodes: use the node-voltage shortcut from Worked example 4.2 (Method B).",
        solution: r`**Assumption:** both batteries are oriented the same way (as drawn), each raising the potential by $\varepsilon$ from the left node to the right node.

**Node voltages.** Let the left node be $0$ and the right node be $V$. Each battery branch has potential $\varepsilon$ on the far side of its battery, so current flows *toward the right node* through each battery branch:

- top: $I_1 = \dfrac{\varepsilon - V}{2R}$
- bottom: $I_3 = \dfrac{\varepsilon - V}{R}$
- middle (right → left): $I_2 = \dfrac{V}{R}$

**Junction rule** at the right node: $I_1 + I_3 = I_2$
$$\frac{\varepsilon - V}{2R} + \frac{\varepsilon - V}{R} = \frac{V}{R} \;\Rightarrow\; 3\varepsilon - 3V = 2V \;\Rightarrow\; V = \tfrac35\varepsilon$$

So $I_1 = \dfrac{\varepsilon}{5R}$, $I_3 = \dfrac{2\varepsilon}{5R}$, $I_2 = \dfrac{3\varepsilon}{5R}$ (all positive, so the guessed directions were right).

*Same thing with loop equations:* top loop $\varepsilon - I_1(2R) - I_2R = 0$, bottom loop $\varepsilon - I_3R - I_2R = 0$, junction $I_1 + I_3 = I_2$.

**Power in the resistors:**
$$P = I_1^2(2R) + I_2^2R + I_3^2R = \frac{\varepsilon^2}{R}\left(\frac{2}{25} + \frac{9}{25} + \frac{4}{25}\right) = \boxed{\frac{3\varepsilon^2}{5R}}$$

**Check with the batteries:** $\varepsilon I_1 + \varepsilon I_3 = \varepsilon\cdot\dfrac{3\varepsilon}{5R}$ ✅ Both batteries deliver power, and the totals match.`,
        answer: r`$P = \dfrac{3\varepsilon^2}{5R}$`,
      },
      {
        id: "v4-q2",
        page: 6,
        title: "Q2 · Charged ball on a string in a magnetic field",
        prompt: r`A **negatively** charged particle (mass $m$) on a string of length $L$ moves in a horizontal circle in a uniform $B$ **into the page**. The string breaks when the tension reaches $T_{\max}$, which happens at speed $v$. What is the magnitude of the charge?`,
        figure: "Top view: the ball is at the top of the circle, moving to the left; the string runs down to the center.",
        hint: "Find the direction of qv×B at the top of the circle. Is the magnetic force inward or outward? Then write radial Newton's 2nd law.",
        solution: r`**Direction.** At the top of the circle, $\vec v = -v\hat x$ and $\vec B = -B\hat z$.
$\vec v \times \vec B \propto (-\hat x)\times(-\hat z) = \hat x\times\hat z = -\hat y$, which points **down, toward the center**, for a *positive* charge.
The charge is **negative** → flip → the magnetic force points **outward**, with size $|q|vB$.

**Newton's 2nd law (radial, inward = +):**
$$T - |q|vB = \frac{mv^2}{L}$$

At the breaking point $T = T_{\max}$:
$$\boxed{|q| = \frac{T_{\max} - \dfrac{mv^2}{L}}{vB} = \frac{T_{\max}L - mv^2}{vBL}}$$

**Check:** units $\dfrac{\text{N}}{(\text{m/s})\,\text{T}} = \text{C}$ ✅. If $B \to 0$, the string breaks at $T_{\max} = mv^2/L$, and then the numerator is zero, as expected ✅.`,
        answer: r`$|q| = \dfrac{T_{\max} - mv^2/L}{vB}$`,
      },
      {
        id: "v4-q3",
        page: 8,
        title: "Q3 · B at the center of a bent wire",
        prompt: r`A long wire comes **down** from infinity, bends around point $P$ in a **quarter circle** of radius $R$ centered on $P$, then runs off to the **right** to infinity. Find $\vec B$ at $P$ (magnitude and direction).`,
        figure: "P is at the corner: the vertical wire is a distance R to the left of P and ends level with P; the horizontal wire is a distance R below P and starts directly under P. The quarter arc joins them through the lower-left.",
        hint: "Two semi-infinite wires (P opposite each end) plus a quarter arc. Check every direction with the right-hand rule.",
        solution: r`Put $P$ at the origin. Three pieces:

**① Vertical wire** (from $y = +\infty$ down to $y = 0$ at $x = -R$). $P$ is opposite its end, at perpendicular distance $R$ → semi-infinite:
$B_1 = \dfrac{\mu_0 I}{4\pi R}$. Direction: $d\vec\ell \times \hat r \propto (-\hat y)\times(+\hat x) = +\hat z$ → **out of the page**.

**② Quarter arc** ($\theta = \pi/2$): $B_2 = \dfrac{\mu_0 I(\pi/2)}{4\pi R} = \dfrac{\mu_0 I}{8R}$. The current goes from the left point to the bottom point, which is **counterclockwise** around $P$ → right-hand rule → **out of the page**.

**③ Horizontal wire** (from $x = 0$ to $+\infty$ at $y = -R$). Again semi-infinite with $P$ opposite its end: $B_3 = \dfrac{\mu_0 I}{4\pi R}$. Direction: $(+\hat x)\times(+\hat y) = +\hat z$ → **out of the page**.

All three point the same way, so they add:
$$\boxed{B = \frac{\mu_0 I}{2\pi R} + \frac{\mu_0 I}{8R}\quad\text{out of the page}}$$

**Justification sentence:** curling the right-hand fingers along the current (down, around counterclockwise, then right), the thumb points out of the page at $P$ for every piece.`,
        answer: r`$B = \dfrac{\mu_0 I}{2\pi R} + \dfrac{\mu_0 I}{8R}$, out of the page`,
      },
      {
        id: "v4-q4",
        page: 10,
        title: "Q4 · Millikan oil drop",
        prompt: r`A power supply is in series with resistor $R$; after it, two more identical resistors $R$ and a parallel-plate capacitor (gap $\ell$) are all in parallel with each other. Once the capacitor is fully charged, what supply voltage suspends a drop of mass $m$ and charge $q$?`,
        hint: "Fully charged → capacitor is a gap. Find the voltage across the parallel group, then set qE = mg.",
        solution: r`**Long time → capacitor = gap.** The circuit is $R$ in series with $(R\parallel R) = R/2$:
$$R_{\text{eq}} = \tfrac32R,\qquad I = \frac{V_s}{\tfrac32R} = \frac{2V_s}{3R}$$

**Voltage across the capacitor** = voltage across the parallel pair:
$$\Delta V_C = I\cdot\frac R2 = \frac{V_s}{3}$$

**Field between the plates:** $E = \dfrac{\Delta V_C}{\ell} = \dfrac{V_s}{3\ell}$

**Suspended → forces balance:** $|q|E = mg$
$$|q|\frac{V_s}{3\ell} = mg \;\Rightarrow\; \boxed{V_s = \frac{3mg\ell}{q}}$$

**Check:** $\dfrac{\text{N·m}}{\text{C}} = \dfrac{\text{J}}{\text{C}} = \text{V}$ ✅. (Same idea as Worked example 4.3.)`,
        answer: r`$V = \dfrac{3mg\ell}{q}$`,
      },
    ],
  },
  {
    id: "v5",
    title: "Practice Exam 2 · Version 5",
    pdf: "/exams/EP2_Exam2_2026_v5.pdf",
    mc: [
      {
        id: "v5-mc1",
        page: 2,
        question: "A negative charge located at the point marked in the figure is released from rest. In which direction does it move?",
        figure:
          "Equipotentials run diagonally from lower-left to upper-right: +30 V, +20 V, +10 V toward the upper-left; −10 V, −20 V, −30 V toward the lower-right. Arrow B points up-left (across the lines toward higher V), D points down-right, A and C point along the lines.",
        options: ["Arrow A", "Arrow B", "Arrow C", "Arrow D", "It doesn't move."],
        answer: 1,
        explanation: r`$\vec E$ is perpendicular to the lines, pointing toward lower $V$ (down-right, arrow D). A negative charge goes **opposite** to $\vec E$, toward higher $V$: **arrow B**.`,
      },
      {
        id: "v5-mc2",
        page: 2,
        question: "Which of these wires has (have) the smallest resistance? Wire A: length L, area A. Wire B: length L/2, area A. Wire C: length L, area 2A.",
        options: [
          "Wire A",
          "Wire B",
          "Wire C",
          "Wires A and B have the same smallest resistance.",
          "Wires B and C have the same smallest resistance.",
          "Wires A and C have the same smallest resistance.",
        ],
        answer: 4,
        explanation: r`In units of $\rho L/A$: A = 1, B = 1/2, C = 1/2. **B and C tie** for smallest.`,
      },
      {
        id: "v5-mc3",
        page: 2,
        question: "Three wires, each on a corner of a square, each carry current I. In which direction is the magnetic field at P, the fourth corner?",
        figure:
          "P is the top-left corner. Top-right: current OUT (⊙). Bottom-left: current OUT (⊙). Bottom-right: current INTO (⊗). Compass: A up, B up-right, C right, D down-right, E down, F down-left, G left, H up-left.",
        options: ["A", "B", "C", "D", "E", "F", "G", "H"],
        answer: 5,
        explanation: r`Let $k = \mu_0 I/2\pi$, side $a$.
Top-right ⊙ (P to its left): CCW → $\frac ka$ **down**.
Bottom-left ⊙ (P above it): CCW → $\frac ka$ **left**.
Bottom-right ⊗ (P up-left, distance $\sqrt2a$): CW → $\frac{k}{\sqrt2 a}$ toward **up-right**, i.e. $\frac{k}{2a}(\hat x + \hat y)$.
Sum: $\frac{k}{2a}(-\hat x - \hat y)$ → **down-left = F**.`,
      },
      {
        id: "v5-mc4",
        page: 3,
        question:
          "Current passes through a metal strip (to the right) with B out of the page. The potential difference ΔV = V_C − V_D > 0, where C is the bottom edge and D the top edge. What is the sign of the charge carrier?",
        options: [
          "Negative, because electrons are always the charge carrier.",
          "Negative, because of the sign of ΔV.",
          "Positive, because current is defined as the motion of positive charge.",
          "Positive, because of the sign of ΔV.",
          "We can't use this information to determine the absolute sign of the charge carrier.",
        ],
        answer: 3,
        explanation: r`Hall recipe: pretend positive moving $+\hat x$. $\hat x \times \hat z = -\hat y$ → carriers pile up on the **bottom edge (C)**. C is measured *higher* → the piled-up charge is positive → **positive carriers, because of the sign of ΔV**.`,
      },
      {
        id: "v5-mc5",
        page: 3,
        question:
          "An uncharged capacitor is wired in series with a resistor R, a battery ε, and an open switch. The switch closes at t = 0. What is the current through the resistor?",
        options: ["The current is zero.", "The current is a constant ε/R.", "The current starts at ε/R then decays to zero.", "The current starts at zero then grows to a constant ε/R."],
        answer: 2,
        explanation: r`At $t=0^+$ the empty capacitor acts like a wire → $I = \varepsilon/R$. Once full it acts like a gap → $I \to 0$. $I = \frac{\varepsilon}{R}e^{-t/RC}$.`,
      },
      {
        id: "v5-mc6",
        page: 3,
        question:
          "A parallel-plate capacitor has been wired in series with a battery ε and a resistor R for a long time. Now the plates are pushed closer together. How does this change the energy stored in the capacitor?",
        options: [
          "It doesn't change because energy must be conserved.",
          "It doesn't change because voltage across the capacitor remains constant.",
          "The energy increases because the capacitance increases.",
          "The energy decreases because the capacitance decreases.",
        ],
        answer: 2,
        explanation: r`Still connected → $\Delta V = \varepsilon$ fixed. Smaller $d$ → bigger $C = \varepsilon_0A/d$ → $U = \tfrac12 C\varepsilon^2$ **increases**. ("Energy is conserved" is the classic wrong reason.)`,
      },
    ],
    fr: [
      {
        id: "v5-q1",
        page: 4,
        title: "Q1 · Net force between a loop and a long wire",
        prompt: r`A rectangular loop (length $a$, width $b$) sits to the left of an infinite wire; its closest side is $2b$ from the wire. The wire carries $I$ **upward**; the loop carries $I$ counterclockwise as drawn (down its left side, up its right side). Find the net force on the **infinite wire** due to the loop.`,
        hint: "Find the force on each side of the loop from the wire's field, let the top and bottom cancel, then use Newton's 3rd law.",
        solution: r`It's easier to find the force **on the loop** from the wire's field, then flip it (Newton's 3rd law).

**Near side** (distance $2b$, current **up**, same direction as the wire) → **attracts**, toward the wire (right):
$$F_{\text{near}} = \frac{\mu_0 I^2 a}{2\pi(2b)}$$

**Far side** (distance $3b$, current **down**, opposite) → **repels**, away from the wire (left):
$$F_{\text{far}} = \frac{\mu_0 I^2 a}{2\pi(3b)}$$

**Top and bottom sides:** they sit in the same field pattern but carry opposite currents, so their (vertical) forces **cancel**.

**Net on the loop** (toward the wire):
$$F = \frac{\mu_0 I^2 a}{2\pi b}\left(\frac12 - \frac13\right) = \frac{\mu_0 I^2 a}{12\pi b}$$

**On the wire (Newton's 3rd):**
$$\boxed{F = \frac{\mu_0 I^2 a}{12\pi b}\quad\text{to the left, toward the loop}}$$`,
        answer: r`$F = \dfrac{\mu_0 I^2 a}{12\pi b}$, toward the loop (left)`,
      },
      {
        id: "v5-q2",
        page: 6,
        title: "Q2 · When is the stored energy half its maximum?",
        prompt: r`A battery, resistors $R$ and $2R$, and capacitors $C$ and $2C$ are all in one series loop with a switch that closes at $t = 0$. When is the energy stored in the capacitors equal to half its maximum value?`,
        hint: "Find R_eq and C_eq. Then remember U ∝ q², so half the energy means q/Qmax = 1/√2.",
        solution: r`**Equivalents (single loop):**
$$R_{\text{eq}} = R + 2R = 3R,\qquad C_{\text{eq}} = \frac{C\cdot 2C}{C + 2C} = \frac{2C}{3},\qquad \tau = R_{\text{eq}}C_{\text{eq}} = 2RC$$

**Energy, not charge!** $U = U_{\max}\left(1 - e^{-t/\tau}\right)^2$. Set $U = \tfrac12U_{\max}$:
$$1 - e^{-t/\tau} = \frac{1}{\sqrt2}\;\Rightarrow\; e^{-t/\tau} = 1 - \frac{1}{\sqrt2}$$
$$t = \tau\ln\!\left(\frac{1}{1 - 1/\sqrt2}\right) = \tau\ln\!\left(2 + \sqrt2\right)$$

$$\boxed{t = 2RC\,\ln\!\left(2+\sqrt2\right) \approx 2.46\,RC}$$

**Check:** longer than the half-*charge* time $2RC\ln2 \approx 1.39RC$ ✅ (energy lags charge).`,
        answer: r`$t = 2RC\ln(2+\sqrt2) \approx 2.46\,RC$`,
      },
      {
        id: "v5-q3",
        page: 8,
        title: "Q3 · Slab with a parabolic current density",
        prompt: r`An infinite conducting slab fills $-d \le z \le d$. The current density, **out of the page**, is $J(z) = J_0\left[1 - (z/d)^2\right]$. Find $\vec B$ at a point $P$ inside the slab at height $z > 0$.`,
        hint: "Same as Worked example 7.4: a rectangle symmetric about z = 0, and I_enc = ∫J dz′ per unit width.",
        solution: r`**Symmetry:** $J(z) = J(-z)$, so $\vec B$ is parallel to the slab, $B = 0$ at $z=0$, and $|B|$ is the same at $\pm z$. For current out of the page, $\vec B$ points **left above** the middle plane and **right below** it.

**Amperian loop:** rectangle of width $\ell$ with edges at $+z$ and $-z$, traversed counterclockwise (out of page = +).
Left side: $\oint\vec B\cdot d\vec\ell = 2B\ell$ (vertical edges give $0$ since $\vec B \perp d\vec\ell$).

**Enclosed current:**
$$I_{\text{enc}} = \ell\int_{-z}^{z} J_0\left(1 - \frac{z'^2}{d^2}\right)dz' = \ell J_0\left(2z - \frac{2z^3}{3d^2}\right)$$

**Ampère:**
$$2B\ell = \mu_0\ell J_0\left(2z - \frac{2z^3}{3d^2}\right)\;\Rightarrow\;\boxed{B = \mu_0J_0\left(z - \frac{z^3}{3d^2}\right)}$$
pointing **parallel to the slab, to the left** at $P$ (above the middle, current out of the page).

**Checks:** $B(0)=0$ ✅. At $z=d$: $B = \tfrac23\mu_0J_0d$, matching the outside value ✅. Units: $\mu_0\cdot\text{A/m}^2\cdot\text{m} = \text{T}$ ✅.`,
        answer: r`$B = \mu_0J_0\left(z - \dfrac{z^3}{3d^2}\right)$, parallel to the slab (to the left above the midplane)`,
      },
      {
        id: "v5-q4",
        page: 10,
        title: "Q4 · Half-full fuel gauge (coax capacitor)",
        prompt: r`A coaxial capacitor (rod radius $a$, pipe inner radius $b$, height $H$) is filled with fuel ($\kappa$) up to height $H/2$; the rest is air. Find its capacitance. Treat all fields as radial.`,
        hint: "Single-field-line test: a radial field line stays entirely in fuel or entirely in air.",
        solution: r`**Single-field-line test:** the field is radial (horizontal). A field line in the bottom half stays in fuel; one in the top half stays in air. No line crosses both → the two halves are in **parallel**.

Each half is a coax of length $H/2$ (and $C \propto$ length):
$$C_{\text{fuel}} = \frac{2\pi\kappa\varepsilon_0(H/2)}{\ln(b/a)},\qquad C_{\text{air}} = \frac{2\pi\varepsilon_0(H/2)}{\ln(b/a)}$$

$$\boxed{C = C_{\text{fuel}} + C_{\text{air}} = \frac{\pi\varepsilon_0H(1+\kappa)}{\ln(b/a)} = \frac{(1+\kappa)H}{4K\ln(b/a)}}$$

**Check:** $\kappa = 1$ gives the empty coax $\dfrac{2\pi\varepsilon_0H}{\ln(b/a)}$ ✅.`,
        answer: r`$C = \dfrac{(1+\kappa)H}{4K\ln(b/a)}$`,
      },
    ],
  },
];
