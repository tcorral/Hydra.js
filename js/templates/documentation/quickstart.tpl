<aside id="toc">
    <nav>
        <div id="toc_title">
            Table of Contents
        </div>
        <ul>
            <li>
                <a href="#quickstart">
                    Quickstart
                </a>
            </li>
            <li>
                <a href="#whatshydra">
                    What's Hydra?
                </a>
            </li>
            <li>
                <a href="#meaningmodulararquitecture">
                    That we mean when we talk about modular architecture?
                </a>
            </li>
            <li>
                <a href="#howtoinstall">
                    How to install Hydra.js.
                </a>
            </li>
            <li>
                <a href="#installadapter">
                    How to install an adapter extension for your base framework.
                </a>
            </li>
            <li>
                <a href="#createadapter">
                    I can't find an adapter for my base framework.
                </a>
            </li>
            <li>
                <a href="#changebaseframework">
                    How to change of base framework without change my code.
                </a>
            </li>
            <li>
                <a href="#modules">
                    Modules.
                </a>
            </li>
            <li>
                <a href="#createmodule">
                    How to create a module.
                </a>
            </li>
            <li>
                <a href="#registermodule">
                    Register a module.
                </a>
            </li>
            <li>
                <a href="#communicatemodules">
                    How to use events to communicate between modules.
                </a>
            </li>
            <li>
                <a href="#startmodule">
                    Start a module.
                </a>
            </li>
            <li>
                <a href="#stopmodule">
                    Stop a module.
                </a>
            </li>
        </ul>
    </nav>
</aside>
<div id="doc_content">
<div>
    <h2 id="quickstart">
        Quickstart
    </h2>

    <div>
        <h3 id="whatshydra">
            What is Hydra?
        </h3>

        <p>
            Hydra is a module oriented and event driven architecture.
        </p>

        <p>
        <h4>What are the motivations behind Hydra.js?</h4>
        <ul id="motivations">
            <li>
                Avoid rewriting your Javascript code each time the base framework is changed.
            </li>
            <li>
                Avoid breaking your application by the smallest erro
            </li>
            <li>
                Minimize dependency problems with your working colleagues when working on a feature, due to Hydra's event driven architecture.
            </li>
        </ul>
        <h4>Where can Hydra.js help your with your application?</h4>
        <ul id="solutions">
            <li>
                Decouple your code from your base framework so you can use it independently on other frameworks without having to adapt or rewrite it.
            </li>
            <li>
                When deploying into an production environment all errors are captured within Hydra.js so your application won't break.
            </li>
            <li>
                All of your application's logic is capsuled in modules that communicate among each other with events. This loosely coupled architecture offers a lot of advantages, especially when it comes to easily interchange parts of your application.
            </li>
        </ul>
    </div>
    <p>
        Hydra.js is based in one presentation from Nicholas Zakas <a
            href="http://www.slideshare.net/nzakas/scalable-javascript-application-architecture"><strong>'Scalable
        Javascript Application Architecture'</strong></a> where he explains how to create architecture to make your
        application more robust and less prone to fail.
    </p>

    <p>
        Hydra architecture can be divided into two different parts.
    </p>
    <ul id="arch_parts">
        <li>
            <strong>Manager: </strong><span>Manage the modules that are registered in your application.</span>
        </li>
        <li>
            <strong>Mediator: </strong><span>Manage the communication between modules when events are launched.</span>
        </li>
    </ul>
    <p>
        Hydra architecture is framework agnostic, this means that is not relevant what type of base framework you're
        using in your application.
    </p>

    <p class="center_content">
        <a href="images/basic_architecture.png" target="_blank">
            <img src="images/basic_architecture_small.png" width="500" height="400"/>
        </a>
    </p>
</div>
<div>
    <h3 id="meaningmodulararquitecture">That we mean when we talk about modular architecture?</h3>

    <p>
        A modular architecture is an architecture where all the code is written in modules and this has some big
        improvements when developing an app.
    </p>
    <h4>What is a module?</h4>

    <p>
        A module is a reusable part of code that has a single responsibility and that doesn't need to know about the
        existence of other modules.
    </p>
    <h4>Improvements</h4>
    <ul id="improvements">
        <li>
            Improve productivity because you can work in parallel with other fellows even if you are not working in the
            same office.
        </li>
        <li>
            The communication between modules is transparent for you and any module can be added to the system without
            having to change code.
        </li>
    </ul>
    <div class="tip">
        Tip: To get the most of Hydra keep in mind to use an abstraction adapter for your base framework.
    </div>
</div>
<div>
    <h3 id="howtoinstall">How to install Hydra?</h3>

    <p>
        To install Hydra in your web/app you can:
        <ul>
            <li>
                Download the version to serve it from your own server. <a href="http://tcorral.github.io/Hydra.js/#downloads">Download</a>
            </li>
            <li>
                Use our self hosted version. <strong>https://raw.github.com/tcorral/Hydra.js/master/src/Hydra.js</strong>
            </li>
            <li>
                Use one of our CDN hosted versions.
                <ul>
                    <li>
                        <strong>//cdnjs.cloudflare.com/ajax/libs/hydra.js/3.1.2/hydra.min.js</strong>
                    </li>
                    <li>
                        <strong>http://cdn.strategiqcommerce.com/ajax/libs/hydra.js/3.1.2/hydra.min.js</strong>
                    </li>
                    <li>
                        <strong>https://cdn.deblan.org/ajax/libs/hydra.js/3.1.2/hydra.min.js</strong>
                    </li>
                </ul>
            </li>
        </ul>
    </p>

    <div>
        <pre><code class="language-javascript">&lt;script type=&quot;text/javascript&quot; src=&quot;path/to/Hydra.js&quot;&gt;&lt;/script&gt;</code></pre>
    </div>
</div>
<div>
    <h3 id="installadapter">How to install an adapter extension for your base framework?</h3>

    <p>
        If you want to get the most of Hydra you must add an adapter for your base framework. An adapter is and must be
        divided into:
    </p>
    <ul>
        <li>
            DOM
        </li>
        <li>
            Ajax
        </li>
        <li>
            Events
        </li>
    </ul>
    <div class="tip">
        Tip: Hydra has adapters for jQuery and Prototype. See <a href="#extensions">extensions section</a>.
    </div>
    <p>
        This is the public API that you could use with adapters:
    </p>
    <ul>
        <li>
            Hydra.<strong>dom</strong>
            <ul>
                <li>
                    <strong>byId</strong> - Return a Node element by id.
                </li>
                <li>
                    <strong>byClassName</strong> - Return a NodeList by a class name.
                </li>
                <li>
                    <strong>byTagName</strong> - Return a NodeList by a tag name.
                </li>
                <li>
                    <strong>byCssSelector</strong> - Return a Nodelist that matches the CSS selector.
                </li>
            </ul>
        </li>
    </ul>
    <ul>
        <li>
            Hydra.<strong>events</strong><br>
            <ul>
                <li>
                    <strong>bind</strong> - Binds an event to one element.
                </li>
                <li>
                    <strong>trigger</strong> - Triggers an event
                </li>
                <li>
                    <strong>unbind</strong> - Unbinds an event from one element
                </li>
            </ul>
        </li>
    </ul>
    <ul>
        <li>
            Hydra.<strong>ajax</strong>
            <ul>
                <li>
                    <strong>call</strong> - Makes an Ajax call totally configurable.
                </li>
                <li>
                    <strong>getJSON</strong> - Makes an Ajax call that expects to retrieve a JSON object.
                </li>
                <li>
                    <strong>getScript</strong> - Makes an Ajax call to get a script and evaluate it in the page.
                </li>
                <li>
                    <strong>jsonP</strong> - Makes a JSONP call to a different domain server.
                </li>
            </ul>
        </li>
    </ul>
    <p>
        An example of using all the adapters for jQuery:
    </p>
    <div>
	<pre><code class="language-javascript">&lt;script type=&quot;text/javascript&quot; src=&quot;path/to/jQuery/src/DOM.js&quot;&gt;&lt;/script&gt;
            &lt;script type=&quot;text/javascript&quot; src=&quot;path/to/jQuery/src/Events.js&quot;&gt;&lt;/script&gt;
            &lt;script type=&quot;text/javascript&quot; src=&quot;path/to/jQuery/src/Ajax.js&quot;&gt;&lt;/script&gt;</code></pre>
    </div>
</div>
<div>
    <h3 id="createadapter">I can't find an adapter for my base framework.</h3>

    <p>
        If you don't find an adapter for your base framework in the <a href="#extensions">extensions section</a> feel
        free to write your own and make a pull request, to add it to the extensions repository, to be used for the
        community.
        <a href="https://github.com/tcorral/Hydra_Extensions/tree/master/jQuery/src">Example</a>
    </p>

    <p>
        This is the public API that any developer will expect from your adapter...
    </p>
    <ul>
        <li>
            Hydra.<strong>dom</strong>
            <ul>
                <li>
                    <strong>byId</strong> - Must return a Node element by id.
                </li>
                <li>
                    <strong>byClassName</strong> - Must return a NodeList by class name.
                </li>
                <li>
                    <strong>byTagName</strong> - Must return a NodeList by a tag name.
                </li>
                <li>
                    <strong>byCssSelector</strong> - Must return a NodeList that matches the CSS selector.
                </li>
            </ul>
        </li>
    </ul>
    <ul>
        <li>
            Hydra.<strong>events</strong><br>
            <ul>
                <li>
                    <strong>bind</strong> - Must bind an event to one element.
                </li>
                <li>
                    <strong>trigger</strong> - Must trigger an event.
                </li>
                <li>
                    <strong>unbind</strong> - Must unbind an event from one element
                </li>
            </ul>
        </li>
    </ul>
    <ul>
        <li>
            Hydra.<strong>ajax</strong>
            <ul>
                <li>
                    <strong>call</strong> - Must make an Ajax  call totally configurable.
                </li>
                <li>
                    <strong>getJSON</strong> - Must make an Ajax  call that expects to retrieve a JSON object.
                </li>
                <li>
                    <strong>getScript</strong> - Must make an Ajax call to get a script and to evaluate it in the page.
                </li>
                <li>
                    <strong>jsonP</strong> - Must make a JSONP call to a different domain server.
                </li>
            </ul>
        </li>
    </ul>
</div>
<div>
    <h3 id="changebaseframework">How to change the base framework without change my code.</h3>

    <p>
        If you need to change your base framework during your development process to could change it without pain if
        you read the last sections where you can see how base frameworks Hydra adapters could help you and what modules
        you can use in your module code.
    </p>
</div>
<div>
    <h3 id="modules">Modules</h3>

    <p>
        Hydra is a module oriented and event driven architecture. This section talks about the modules and how they
        work.
    </p>

    <p>
        A module could be of two different types:
    </p>
    <ul>
        <li>
            Logic: Used to manage flow controls or that doesn't need to be tied to the Browser.
        </li>
        <li>
            Visual: Used in web applications and that hijack some parts of the web page.
        </li>
    </ul>
</div>
<div>
    <h4 id="createmodule">How create a module.</h4>

    <p class="h4">Hydra modules use the <a
            href="http://blog.alexanderdickson.com/javascript-revealing-module-pattern">module revealing</a> pattern.
    </p>

    <p class="h4">
        A sample of the module with the minimum required:
    </p>

    <div>
	<pre><code class="language-javascript">function( bus ){
            return {
            init: function(){
            // Code that will be executed when this module is started.
            }
            };
            }</code></pre>
    </div>
</div>
<div>
    <h4 id="registermodule">Register a module.</h4>

    <p class="h4">
        To add a module to the manager in Hydra you need to register it.
    </p>

    <p class="h4">
        Sample of register a module:
    </p>

    <div>
	<pre><code class="language-javascript">Hydra.module.register( 'my-fist-module', function( bus ){
            return {
            init: function(){
            // Code that will be executed when this module is started.
            }
            };
            });</code></pre>
    </div>
</div>
<div>
    <h4 id="communicatemodules">How to use events to communicate between modules.</h4>

    <p class="h4">
        All the modules know about its existence but not about the existence of other modules. This section explains
        how to use events to allow communication between modules using events that will be managed by Hydra Mediator.
    </p>
    <h5>Subscribing to one channel:</h5>

    <p class="h5">
        To be able to subscribe to one channel even if it's the 'global' channel, you need a property object called
        events, the keys of this object must match with the name of the event we want to listen, the values
        must be the callbacks to be executed when the event is triggered.
    </p>

    <div class="tip">
        Tip: The context object <em>(this)</em> of event callback will be the module/object itself.
    </div>
    <div>
	<pre><code class="language-javascript">Hydra.module.register( 'my-first-module', function( bus ){
            return {
            events: {
            'channel_name': {
            'user-clicks-button': function ( oNotify ) {
            this._logClick( oNotify.sButtonType );
            }
            }
            },
            _logClick: function( sButtonType ) {
            console.log("User clicked a ' + sButtonType + ' button");
            },
            init: function() {
            // The subscribe is done by Hydra.js when the module is started.
            // Code that will be executed when this module is started.
            }
            };
            });</code></pre>
    </div>
    <h5>Publishing an event in one channel:</h5>

    <p class="h5">
        When a module needs to communicate with other modules, it must use events to publish actions in the modules
        that are subscribed to the channel and the called event.
    </p>

    <p class="h5">
        If you want to publish an event you need to know in which channel and what event you want to publish it and
        what event using “Bus” that is the Mediator object that manage the communication between modules.
    </p>

    <div>
	<pre><code class="language-javascript">Hydra.module.register( 'my-second-module', function( bus ){
            return {
            setButtonBehaviour: function()
            {
            // When the button is clicked it triggers the 'user-clicks-button' event that will
            // execute the callbacks defined for this event in other modules if some of them is
            // listening the event.
            Hydra.events.bind( document.getElementById( "button" ), function() {
            bus.publish( 'channel_name', 'event_name', { } );
            });
            },
            init: function(){
            this.setButtonBehaviour();
            }
            };
            });</code></pre>
    </div>

    <h5>Unregistering from one channel:</h5>

    <p class="h5">
        When you want to stop responding to messages launched from one channel you need to unregister your module
        from it.
    </p>

    <div>
	<pre><code class="language-javascript">Hydra.module.register( 'my-second-module', function( bus ){
            return {
            setButtonBehaviour: function()
            {
            // When the button is clicked it triggers the 'user-clicks-button' event that will
            // execute the callbacks defined for this event in other modules if some of them is
            // listening the event.
            Hydra.events.bind( document.getElementById( "button" ), function() {
            bus.publish( 'channel_name', 'event_name', { } );
            });
            },
            init: function(){
            this.setButtonBehaviour();
            },
            onDestroy: function()
            {
            bus.unsubscribe('channel_name', this);
            }
            };
            });</code></pre>
    </div>
</div>
<div>
    <h3 id="startmodule">Start a module.</h3>

    <p>
        Now that you know how to create and register a module to the system, now you will learn how to start it. <br>
        Hydra is a multi-instance module system this is the reason because you will need to add a single identifier for
        the instance of the module to be started.
    </p>

    <div>
        When a module is started it follows the next process:
    </div>
    <ol>
        <li>
            Checks all the events to be listened in the module and starts listening them.
        </li>
        <li>
            If debug mode is not active all the methods in module are wrapped to avoid it make fail all the application
            because a little error.
        </li>
        <li>
            Create an instance of the module.
        </li>
        <li>
            Execute the “init” method inside of the module.
        </li>
    </ol>
    <p>
        <strong>Sample of simple start module:</strong>
    </p>
    <div>
        <pre><code class="language-javascript">Hydra.module.start('my-first-module', 'my-instance');</code></pre>
    </div>
    <div class="tip">
        Tip: Start method accepts the parameters if you pass anything as third parameter, this will be passed arguments
        in the “init” method
    </div>
    <div>
        <strong>Sample of simple start module with parameters:</strong>
    </div>
    <p>
        Sample of Module with “init” method with parameters.
    </p>
    <div>
	<pre><code class="language-javascript">Hydra.module.register( 'my-first-module', function( bus ) {
            return {
            init: function( data ) {
            alert( data.hello );
            }
            };
            });

            Hydra.module.start( 'my-first-module', 'my-instance', { hello: 'hello world!' } );</code></pre>
    </div>
</div>
<div>
    <h3 id="stopmodule">Stop a module.</h3>

    <p>
        When a module has no sense in any view (normally in single page applications) you can stop it to avoid continue
        listening events.
    </p>

    <div class="tip">
        Tip: If you something more than just remove listeners you can use the 'onDestroy' method where you could remove
        some expensive resource as web workers or drivers to access NoSQL databases.
    </div>
    <div>
        <pre><code class="language-javascript">Hydra.module.stop( 'my-first-module', 'my-instance' ); </code></pre>
    </div>
</div>
</div>