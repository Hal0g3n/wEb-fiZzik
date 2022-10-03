# What are they?

<img src="https://d2kspx2x29brck.cloudfront.net/1200x675/filters:format(webp)/img/iea/y5wWkZZlwX/what-is-a-neutron-star-1.jpg"></img>

> *From the death of a supergiant star, <br>
> birthed a smaller star shining so bright.   <br>
> In space with darkness close to tar,    <br>
> neutron stars fights back with its last light.*

## A Prelude
You may have heard of neutron stars before, but what are really they?
Neutron stars are very nearly the densest objects in the universe, right before black holes.
With a mass close to that of our sun, they are usually a few dozen kilometers across.

Neutron stars are fundamentally different from stars, despite the name.
Stars generate heat energy through nuclei fusion, 

But how do they form?

When giant stars die, they can go supernova -- i.e. explode with the power
output of an entire galaxy -- and form one of two things. If the star was big enough,
then the remnants of the star rushing inwards before the explosion get close enough
together that gravity can overcome the Pauli Exclusion principle (we'll get to that later)
and form a black hole, with a singularity of infinite density and extreme mass.

If the star wasn't quite massive enough, though, what's formed is instead a neutron
star, and that's where things get weird. Normal stars are permanently in a precarious balance between collapse and expansion, with the inward force of gravity and the outward force of the continuous nuclear fusion in the star balancing out, by necessity. Neutron stars are different, though; they're stopped from collapsing by the Pauli Exclusion principle, explained later in [The Theory Behind Neutron Stars](/2 The Theory behind Neutron Stars).

<!-- Quiz -->
<details>
<summary>Self Check</summary>

<span style='font-size: 3ch'> What is your favourite language? </span>
<div class='quiz'>
    <button class="quizBtn" name="Q1_right" onClick="markQ1.call(this)">HTML</button>
    <button class="quizBtn" name="Q1_wrong" onClick="markQ1.call(this)">CSS</button>
    <button class="quizBtn" name="Q1_wrong" onClick="markQ1.call(this)">Java</button>
    <hr>
    <div id='test'></div>
</div> 

<script>
var markQ1 = function(button) {   
	const right = document.getElementsByName("Q1_right")
    const wrong = document.getElementsByName("Q1_wrong")
    
    if (this.name == "Q1_wrong") this.classList.add("quizIncorrect")

    for (const btn of wrong) btn.disabled = true;
	for (const btn of right) {
        btn.classList.add("quizCorrect")
        btn.disabled = true;
    }

    document.getElementById("test").innerText = this.name=="Q1_wrong" ? "Incorrect! 😔" : "Correct! 🎉";
    document.getElementById("test").innerText += `
    Java is cancer, CSS is hard.
    Only HTML is easy and good.
    `;
}
</script>
</details>
<!-- /Quiz -->


## Why they're called neutron stars

As you may have guessed, neutron stars are made primarily out of neutrons. If you need a refresher, neutrons, along with protons, are what make up the nuclei of atoms ("nuclei" are the hard centers of atoms, surrounded by fuzzy layers of electrons). But all these neutrons have to come from somewhere, and in neutron starts that turns out to be from the combining of protons and electrons.

Under the incredible pressures inside neutron stars, at a certain point, compressing the same stuff into a small volume becomes inefficient. Instead, it's more energetically viable to compress particles together, fusing negatively charged electrons and positively charged protons together to form neutral neutrons. It's so much more viable, in fact, that as one gets deeper into a neutron star, neutrons are nearly the only things you'll find.

The insides of neutron stars are somewhat unknown to us, and we only have theories, but those theories tell us that it probably starts out as iron, turns into spaghetti, and then becomes soup. Indeed, the scientific term for the matter in the inner crusts of neutron stars is "Nuclear Pasta". So let's dig in, shall we?

## The layers of a neutron star

We begin at the "atmosphere" of a neutron star. It has thickness on the order of a human hair, and rather than flowing like a normal atmosphere, is beholden to the star's tremendous magnetic field.

A hair in, we encounter the outer crust. Scientists aren't quite sure what makes up this portion of the crust, but many think that it's comprised of iron atoms crushed together into a giant, neutron-star sized shell. Diving into the inner crust, we encounter the first type of nuclear pasta - the gnocchi phase. The gnocchi phase is, as the name would suggest, comprised of blobs. These blobs are actually nuclei that have been squished so close together that they actually touch, and start to merge with each other. Go down farther, and we reach the spaghetti phase, where these blobs themselves merge with each other, forming long, tangled strands of super-nuclei.

Past spaghetti, naturally, comes lasagna, where these strands form long, planar sheets of protons and neutrons. By this point, the notion of an individual nucleus becomes somewhat nonsensical. But what after lasagna? The answer, it turns out, is anti-pasta. Lasagna turns into anti-spaghetti, sheets forming hollow tubes spitting out free neutrons (as opposed to bound neutrons, which are attached to other neutrons and protons). And when deeper still in, anti-spaghetti forms anti-gnocchi, tubes breaking up into hollow bubbles.

Having exhausted the culinary delights, we reach the core of neutron stars. By definition, at this point, the vast majority of particles are neutrons. Neutron star cores are some of the most extreme places in the universe, second only to black holes themselves, and bear similarities to the conditions the universe found itself in shortly after the big bang. Because of this, they are of great interest to researchers, as they provide a glimpse into the far past.

Other than that though, we don't know for sure what the core looks like. Researchers have put forth many theories, from a neutron-degenerate  superfluid (a fluid with no thickness), to a mix of neutrons and other rarer particles, such as pions and kaons. One of the most interesting, and possibly the weirdest, involves hyper-dense matter supported by quark-degeneracy, and a little something known as... strange matter.