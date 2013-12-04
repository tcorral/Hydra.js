<aside id="toc">
    <nav>
        <div id="toc_title">
            Table of Contents
        </div>
        <ul>
            <li>
                <a href="#use_with_requirejs">
                    Getting Started.
                </a>
            </li>
            <li>
                <a href="#hydra_with_requirejs">
                    Use Hydra with Require.js
                </a>
            </li>
            <li>
                <a href="#examples_of_usage">
                    Examples of usage.
                </a>
            </li>
            <li>
                <a href="#how_to_execute_this_example">
                    How to execute this example.
                </a>
            </li>
            <li>
                <a href="#how_it_works">
                    How it works.
                </a>
            </li>
        </ul>
    </nav>
</aside>
<div id="doc_content">
	<div>
		<h2 id="use_with_requirejs">
			Getting Started:
		</h2>
	</div>
	<div>
		<h3 id="hydra_with_requirejs">
            Use Hydra with Require.js
		</h3>
		<p>
            In this section I will show you how to use Hydra with Require.js
            <div>
                To use Hydra with Require you will need to download Require.js and Hydra to your libs path folder.
                <ul>
                    <li>
                        <a href="http://requirejs.org/docs/download.html">Download Require.js</a>
                    </li>
                    <li>
                        <a href="#downloads">Download Hydra</a>
                    </li>
                </ul>
                Please follow the example below for more information.
            </div>
		</p>
	</div>
    <div>
        <h4 id="examples_of_usage">
            Example of usage:
        </h4>
        <p class="h4">
            Here you will see the different parts of one simple application using Require.js to load our Hydra modules.
            <ul>
                <li>
                    <div>
                        <strong>index.html</strong>
                        <pre><code class="  language-markup">&lt;!DOCTYPE html&gt;
&lt;html&gt;
    &lt;head&gt;
        &lt;title&gt;Example page&lt;/title&gt;
        &lt;script type="text/javascript" data-main="js/app" src="js/libs/require.js"&gt;&lt;/script&gt;
    &lt;/head&gt;
    &lt;body&gt;

    &lt;/body&gt;
&lt;/html&gt;</code></pre>
                    </div>
                </li>
                <li>
                    <div>
                        <strong>app.js</strong>
                        <pre><code class="language-javascript">require.config({
    paths:{
        hydra:'libs/hydra',
    }
});
define(['hydra', 'modules/module'], function (Hydra) {
    console.log(Hydra.version);
});</code></pre>
                    </div>
                </li>
                <li>
                    <div>
                        <strong>module.js</strong>
                            <pre><code class="language-javascript">define(['hydra', '../../js/modules/other_module.js'], function (Hydra, Other) {
    Other.start();
    var Mod = Hydra.module.register( 'module', function ( Bus, Module, ErrorHandler, Api ) {
        return {
            init:function () {
                Bus.publish('channel', 'item:action', {});
                console.log('module started');
            }
        };
    });
    Mod.start();
});</code></pre>
                    </div>
                </li>
                <li>
                    <div>
                        <strong>other_module.js</strong>
                                <pre><code class="language-javascript">define(['hydra'], function (Hydra) {
    return Hydra.module.register( 'other', function ( Bus, Module, ErrorHandler, Api ) {
        return {
            init:function () {
                Bus.subscribeTo('channel', 'item:action', function () {
                    console.log('other started');
                }, this);
                console.log('other module started');
            }
        };
    });
});</code></pre>
                    </div>
                </li>
            </ul>
        </p>
    </div>
    <div>
        <h4 id="how_to_execute_this_example">How to execute this example</h4>
        <p class="h4">
            To execute this example you will need to download the <a href="https://github.com/tcorral/Hydra_with_requireJS/archive/master.zip">code</a> and add it to your HTML path in any web server.
        </p>
        <p class="h4">
            When the code is executed you have to see the console of your browser and you will find the next lines on it.
        <div class="tip">[version] will be replaced with the current version of Hydra.</div>
        <div>
            <pre><code class="language-javascript">other module started
other started
module started
[version]</code></pre>
        </div>
        </p>
    </div>
    <div>
        <h4 id="how_it_works">How it works</h4>
        <p class="h4">
            To understand how it works we start having a look at the <strong>'index.html'</strong> file.
            <ul>
                <li>
                    <div>
                        <pre><code class="language-markup">&lt;script type="text/javascript" data-main="js/app" src="js/libs/require.js"&gt;&lt;/script&gt;</code></pre>
                    </div>
                    As you can see in this code snippet we are using the pattern used in any application that uses <a href="http://requirejs.org/docs/start.html">Require.js</a>
                    When the file require.js is loaded then it loads app.js file and executes its code.
                </li>
                <li>
                    What is being executed in <strong>app.js</strong> file.
                    <ul>
                        <li>
                            We define the hydra path to point to Hydra using <em>require.config</em> after this definition we can use 'hydra' to require Hydra.
                            <div>
                                <pre><code class="language-javascript">require.config({
    paths:{
        hydra:'libs/hydra'
    }
});</code></pre>
                            </div>
                        </li>
                        <li>
                            Start our application.
                            <div>
                                <pre><code class="language-javascript">define(['hydra', 'modules/module'], function (Hydra) {
    console.log(Hydra.version);
});</code></pre>
                            </div>
                            In this snipped we require hydra and our first module called <em>'module'</em>. The work flow in Require.js will load all the libraries and dependencies before executing the code in this callback, then we will see what's being executed inside <em>'module'</em>.
                        </li>
                    </ul>
                </li>
                <li>
                    What is being executed in <strong>module.js</strong> file.
                    <ul>
                        <li>
                            Code in <em>'module.js'</em> file
                            <div>
                                <pre><code class="language-javascript">define(['hydra', '../../js/modules/other_module.js'], function (Hydra, Other) {
    Other.start();
    var Mod = Hydra.module.register('module', function ( Bus, Module, ErrorHandler, Api ) {
        return {
            init:function () {
                Bus.publish('channel', 'item:action', {});
                console.log('module started');
            }
        };
    });
    Mod.start();
});</code></pre>
                            </div>
                            In this code we can see how <em>'other_module'</em> is required, after continue reviewing the <em>'module'</em> code we should check what will going on when the <em>'other module'</em> is loaded.
                            <ul>
                                <li>
                                    What is being executed in <strong>other_module.js</strong> file.
                                    <div>
                                <pre><code class="language-javascript">define(['hydra'], function (Hydra) {
    return Hydra.module.register( 'other', function ( Bus, Module, ErrorHandler, Api ) {
        return {
            init:function () {
                Bus.subscribeTo('channel', 'item:action', function () {
                    console.log('other started');
                }, this);
                console.log('other module started');
            }
        };
    });
});</code></pre>
                                    </div>
                                    In this code we can see how a module is created using Hydra.module.register that returns the instance of the module.
                                    <div>
                                        When this module is started the init function will be executed then the module will start listening the event <strong>'item:action'</strong> in the channel <strong>'channel'</strong>, if this event is triggered we should see the <em>'other started'</em> message in the console, in any case the message <em>'other module started'</em> will be shown in the console.
                                    </div>
                                </li>
                            </ul>
                        </li>
                        <li>
                            After seeing what's happening in 'other_module.js' we can continue reviewing the code in 'module.js'
                            <div>
                                <pre><code class="language-javascript">Other.start();</code></pre>
                            </div>
                            When we required 'other_module' we received the instance of the module in the local variable Other. In this code we start the module.
                            <div>
                                When this module is started we can see the next line/s in the console.
                            </div>
                            <div><pre><code class="language-javascript">other module started</code></pre>
    </div>
                        </li>
                        <li>
                            Create a new Hydra module using Hydra.module.register.
                            <div><pre><code class="language-javascript">var Mod = Hydra.module.register('module', function ( Bus, Module, ErrorHandler, Api ) {
    return {
        init:function () {
            Bus.publish('channel', 'item:action', {});
            console.log('module started');
        }
    };
});</code></pre>
                            </div>
                            <div>
                                As you can see in the code snippet we create a new module called 'module'. When this module is started it will trigger the event 'item:action' in channel 'channel' that is listened by the 'other_module' module, in any case it will write 'module started' message in console.
                            </div>
                        </li>
                        <li>
                            Start Mod module.
                            <div><pre><code class="language-javascript">Mod.start();</code></pre>
                            </div>
                            When the module is started it will trigger the event in 'other_module' this will show the next line/s in console.
                            <div><pre><code class="language-javascript">other started
module started</code></pre>
                            </div>
                        </li>
                        <li>
                            After executing all the code in 'module.js' the line in app.js its executed and the last line is written in your console.
                            <div class="tip">[version] will be replaced with the current version of Hydra.</div>
                            <div><pre><code class="language-javascript">[version]</code></pre>
                        </li>
                    </ul>
                </li>
            </ul>
        </p>
    </div>
</div>