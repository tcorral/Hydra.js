<aside id="toc">
    <nav>
        <div id="toc_title">
            Table of Contents
        </div>
        <ul>
            <li>
                <a href="#use_with_nodejs">
                    Getting Started.
                </a>
            </li>
            <li>
                <a href="#install_hydra">
                    Install Hydra with Node.js
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
        <h2 id="use_with_nodejs">
            Getting Started:
        </h2>
    </div>
    <div>
        <h3 id="install_hydra">
            Install Hydra with Node.js
        </h3>
        <p>
            To install Hydra as a node.js module you need to write one of these commands in your command line from the root of your project.
            <ul>
                <li>
                    If you only want to add Hydra to your project:
                    <div>
                        <pre><code class="language-javascript">npm install hydra.js</code></pre>
                    </div>
                </li>
                <li>
                    If you have a package.json and want to add Hydra:
                    <div>
                        <pre><code class="language-javascript">npm install hydra.js --save</code></pre>
                    </div>
                    This command will add Hydra to your package.json dependencies.
                </li>
            </ul>
            After installing Hydra in your project you can access to it using require and can be used as usual.
        </p>
    </div>
    <div>
        <h4 id="examples_of_usage">
            Example of usage:
        </h4>
        <p class="h4">
            <ul>
                <li>
                    Here you can see two examples files that interact together.
                    <div>
                        <strong>other_module.js</strong>
                        <pre><code class="language-javascript">
var Hydra, Other;
Hydra = require('hydra.js');
Other = {};
Other.original = Hydra.module.register('other', function(bus)
{
    return {
        init: function()
        {
            console.log('init other', +new Date());
            bus.subscribeTo('channel', 'lol:say', function(oData)
            {
                console.log('lol', +new Date(), oData);
            }, this);
        }
    };
});
Other.extended = Other.original.extend('other2', function(bus)
{
    return {
        init: function()
        {
            console.log('init other2', +new Date());
            bus.subscribeTo('channel', 'lol:say', function(oData)
            {
                console.log('lol2', +new Date(), oData);
            }, this);
        },
        onDestroy: function()
        {
            bus.unsubscribeFrom('channel', 'lol:say', this);
        }
    };
});
module.exports = Other;
                        </code></pre>
                    </div>
                    <div>
                        <strong>module.js</strong>
                        <pre><code class="language-javascript">
var Other,Hydra, Test;
Hydra = require('hydra.js');
Other = require('./other_module.js');

Other.original.start();

Hydra.bus.publish('channel', 'lol:say', {from: 'out_1'});

Other.original.stop();

Other.extended.start();
Other.extended.stop();
Hydra.bus.publish('channel', 'lol:say', {from: 'out_2'});

Test = Hydra.module.register('test', function(bus)
{
    return {
        init: function()
        {
            console.log('init test', +new Date());
            bus.publish('channel', 'lol:say', {from: 'in'});
            console.log('ein', +new Date());
        }
    };
});
Test.start();</code></pre>
                    </div>
                </li>
            </ul>
        </p>
    </div>
    <div>
        <h4 id="how_to_execute_this_example">How to execute this example</h4>
        <p class="h4">
            <ul>
                <li>
                    <strong>Execute this example.</strong>
                    <div>
                        Install Hydra:
                        <pre><code class="language-javascript">npm install hydra.js</code></pre>
                    </div>
                    <div>
                        You can execute this example using:
                        <pre><code class="language-javascript">node module.js</code></pre>
                    </div>
                </li>
                <li>
                    <strong>You will get something similar to this code in your console:</strong>
                    <div class="tip">
                        [timestamp] will be replaced by the current timestamp
                    </div>
                    <div>
                            <pre><code class="language-javascript">
init other [timestamp]
lol [timestamp] { from: 'out_1' }
init other2 [timestamp]
lol [timestamp] { from: 'out_2' }
init test [timestamp]
lol [timestamp] { from: 'in' }
ein [timestamp]
                                </code></pre>
                    </div>
                </li>
            </ul>
        </p>
    </div>
    <div>
        <h4 id="how_it_works">How it works</h4>
        <p class="h4">
            To understand how it works we need to have a look at the <strong>'module.js'</strong> file.
            <ul>
                <li>
                    Some variables that we will use in our script are declared.
                    <div>
                        <pre><code class="language-javascript">var Other, Hydra, Test;</code></pre>
                    </div>
                </li>
                <li>
                    Require Hydra.
                    <div>
                        <pre><code class="language-javascript">Hydra = require('hydra.js');</code></pre>
                    </div>
                </li>
                <li>
                    Require 'other_module.js'.
                    <div>
                        <pre><code class="language-javascript">Other = require('./other_module.js');</code></pre>
                    </div>
                    To know what <strong>'other_module.js'</strong> does we need to check it's content:
                    <ul>
                        <li>
                            Some variables that we will use in our script are declared.
                            <div>
                                <pre><code class="language-javascript">var Hydra, Other;</code></pre>
                            </div>
                        </li>
                        <li>
                            Require Hydra.
                            <div>
                                <pre><code class="language-javascript">Hydra = require('hydra.js');</code></pre>
                            </div>
                        </li>
                        <li>
                            Create a namespace to store two modules:
                            <div>
                                <pre><code class="language-javascript">Other = {};</code></pre>
                            </div>
                        </li>
                        <li>
                            Use namespace to store a base module:
                            <div>
                                <pre><code class="language-javascript">
// Using Hydra.module.register will return the instance of the module
// then we can store this instance as the original module in the Other namespace.
Other.original = Hydra.module.register('other', function(bus)
{
    return {
        init: function()
        {
            // The line below it is executed when the original module is started.
            console.log('init other', +new Date());
            // Use bus.subscribeTo to make this module react to the 'lol:say' event
            // in the channel 'channel'.
            // If the event 'lol:say' in the channel 'channel' is triggered, the
            // callback will be executed.
            bus.subscribeTo('channel', 'lol:say', function(oData)
            {
                console.log('lol', +new Date(), oData);
            }, this);
        }
    };
});
                                </code></pre>
                            </div>
                        </li>
                        <li>
                            Use namespace to store a module that extends from Other.original module:
                            <div>
                                <pre><code class="language-javascript">
// Using Other.original.extend will extend the base module stored in Other.original
// and will return the extended instance of the module then we can store this instance
// as the extended module in the Other namespace.
Other.extended = Other.original.extend('other2', function(bus)
{
    return {
        init: function()
        {
            // The line below it is executed when the extended module is started.
            console.log('init other2', +new Date());
            // Use bus.subscribeTo to make this module react to the 'lol:say' event
            // in the channel 'channel'.
            // If the event 'lol:say' in the channel 'channel' is triggered, the
            // callback will be executed.
            bus.subscribeTo('channel', 'lol:say', function(oData)
            {
                console.log('lol2', +new Date(), oData);
            }, this);
        },
        onDestroy: function()
        {
            // This callback it is executed when the modules is stopped.
            // The line below will stop listening the event 'lol:say' in
            // the channel 'channel'.
            bus.unsubscribeFrom('channel', 'lol:say', this);
        }
    };
});
                                    </code></pre>
                            </div>
                        </li>
                        <li>
                            Exports the Other namespace to use it from other parts of the application:
                            <div>
                                <pre><code class="language-javascript">module.exports = Other;</code></pre>
                            </div>
                        </li>
                    </ul>
                    <div class="tip">When we require a module we get the objects or functions that we have exported.</div>
                </li>
                <li>
                    Start the original module.
                    <div>
                        <pre><code class="language-javascript">Other.original.start();</code></pre>
                    </div>
                    After starting the original module we should see the next line/s in the console.
                    <div>
                        <pre><code class="language-javascript">init other [timestamp]</code></pre>
                    </div>
                    Then it will start to listen the event 'lol:say' in the channel 'channel'.
                </li>
                <li>
                    Trigger the event 'lol:say' in the channel 'channel'.
                    <div>
                        <pre><code class="language-javascript">Hydra.bus.publish('channel', 'lol:say', {from: 'out_1'});</code></pre>
                    </div>
                    We trigger the event and we pass an object to the callback to be executed.
                    This will we added to your console.
                    <div>
                        <pre><code class="language-javascript">lol [timestamp] { from: 'out_1' }</code></pre>
                    </div>
                </li>
                <li>
                    Stop the original module.
                    <div>
                        <pre><code class="language-javascript">Other.original.stop();</code></pre>
                    </div>
                    After stopping the original module it will continue reacting to the 'lol:say' event in the channel 'channel', because when you use subscribeTo you have to unsubscribe it explicitly.
                </li>
                <li>
                    Start the extended module.
                    <div>
                        <pre><code class="language-javascript">Other.extended.start();</code></pre>
                    </div>
                    After starting the original module we should see the next line/s in the console.
                    <div>
                        <pre><code class="language-javascript">init other2 [timestamp]</code></pre>
                    </div>
                    Then it will start to listen the event 'lol:say' in the channel 'channel'.
                </li>
                <li>
                    Stop the extended module.
                    <div>
                        <pre><code class="language-javascript">Other.extended.stop();</code></pre>
                    </div>
                    After stopping the extended module it will not react more to the 'lol:say' event in the channel 'channel', because we added the unsubscribe to the onDestroy method.
                </li>
                <li>
                    Trigger the event 'lol:say' in the channel 'channel'.
                    This event is listened by the original module.
                    <div>
                        <pre><code class="language-javascript">Hydra.bus.publish('channel', 'lol:say', {from: 'out_2'});</code></pre>
                    </div>
                    We trigger the event and we pass an object to the callback to be executed.
                    This will we added to your console.
                    <div>
                        <pre><code class="language-javascript">lol [timestamp] { from: 'out_2' }</code></pre>
                    </div>
                </li>
                <li>
                    Create a new Hydra module called 'test'
                    <div>
                        <pre><code class="language-javascript">
// Using Hydra.module.register will return the instance of the module
// then we can store this instance in the Test variable.
Test = Hydra.module.register('test', function(bus)
{
    return {
        init: function()
        {
            // The line below it is executed when the Test module is started.
            console.log('init test', +new Date());
            // When the Test module is started a 'lol:say' event in channel 'channel' is triggered.
            bus.publish('channel', 'lol:say', {from: 'in'});
            // The line below it is executed after executing the callback of the 'lol:say' event.
            console.log('ein', +new Date());
        }
    };
});
                        </code></pre>
                    </div>
                </li>
                <li>
                    Start the Test module.
                    <div>
                        <pre><code class="language-javascript">Test.start();</code></pre>
                    </div>
                    After starting the original module we should see the next line/s in the console.
                    <div>
                        <pre><code class="language-javascript">init test [timestamp]
lol [timestamp] { from: 'in' }
ein [timestamp]</code></pre>
                    </div>
                </li>
            </ul>
        </p>
    </div>
    <div>
        <h4 id="download_code">Download this code</h4>
        <p class="h4">
            <a href="https://github.com/tcorral/Hydra_with_NodeJS/archive/master.zip">Download</a>
        </p>
    </div>
</div>
