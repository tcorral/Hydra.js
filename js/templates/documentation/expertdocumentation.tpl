<div id="doc_content">
	<div>
		<h2 id="expert_documentation">
			Expert Documentation
		</h2>
	</div>
	<div>
		<h3 id="design_patterns">
			Design patterns used to create Hydra.js
		</h3>
		<p>
			Hydra.js has been created using two different and powerful design patterns:
		</p>
	</div>
	<div>
		<h4 id="mediator_pattern">
			Mediator
		</h4>
		<p class="h4">
			Mediator pattern is used to manage the communications between all the instance of modules that are listening
			for events. This pattern allows the modules launch events without needing to know which module is loaded.
			Modules are listening events and when one of the listening events is triggered, is the mediator who tells the
			listening modules what to execute.
		</p>
	</div>
	<div>
		<h4 id="observer_pattern">
			Observer
		</h4>
		<p class="h4">
			Observer pattern is used to register modules to the system only allowing to execute the registered modules in
			the system.
		</p>
	</div>
	<div>
		<h3 id="uml_graph">
			UML Diagram of Hydra.js and used classes.
		</h3>
		<p>
			<img src="images/hydra_class_diagram.png"/>
		</p>
	</div>
	<div>
		<h4 id="other">
			Other important info:
		</h4>
		<p class="h4">
			<a href="#apis">API documentation</a>
		</p>
	</div>
</div>