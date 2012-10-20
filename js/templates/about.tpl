<div id="impact">
	<div class="left">
		<div class="frame">
			<div class="left">
				<div id="framework_agnostic">
					<img src="images/framework_agnostic.png" width="360" height="268"/>
				</div>
			</div>
			<div class="left">
				<div id="modular">
					<img src="images/modular.png" width="160" height="120"/>
				</div>
				<div id="extensible">
					<img src="images/extensible.png" width="160" height="120"/>
				</div>
			</div>
		</div>
	</div>
	<div class="right">
		<div id="slogan">
			<img src="images/blue_logo_word.png" width="88" height="18"/>
			<span><%= home.slogan %></span>
		</div>
		<p>
			<%= home.description_1%>
		</p>
		<p>
			<%= home.description_2%>
		</p>
		<ul>
			<li>
				<%= home.features_list.change_framework%>
			</li>
			<li>
				<%= home.features_list.communicate_modules%>
			</li>
			<li>
				<%= home.features_list.easy_extension%>
			</li>
		</ul>
		<div id="download_hydra_about">
			<ul>
				<li>
					<input type="radio" value="development" checked="true" data-url="https://raw.github.com/tcorral/Hydra.js/master/versions/hydra.js" name="download"/>
					<label><%= home.download_options.development%></label>
				</li>
				<li>
					<input type="radio" value="production" data-url="https://github.com/tcorral/Hydra.js/raw/master/versions/hydra.min.js.gz" name="download"/>
					<label><%= home.download_options.production%></label>
				</li>
			</ul>
			<a href="https://raw.github.com/tcorral/Hydra.js/master/versions/hydra.js" class="blank">
				<img src="images/download_button_about.png" width="273" height="36"/>
			</a>
			<div id='current_release'>
				<span class='title'>Current release:</span><span class='version'>v. 2.7.0</span>
			</div>
		</div>
	</div>
</div>
<div id="links">
	<ul>
		<li>
			<div class="softonic">
				<div>
					<img src="images/softonic_screenshot.png" width="261" height="184"/>
				</div>
				<p>
					<strong>"<%= home.softonic.quote%>"</strong>
				</p>
				<p>
					<%= home.softonic.description%>
				</p>
				<a href="http://www.softonic.com" class="button">
					Link
				</a>
			</div>
		</li>
		<li>
			<div class="byveo">
				<div>
					<img src="images/byveo_screenshot.png" width="261" height="184"/>
				</div>
				<p>
					<strong>"<%= home.byveo.quote%>"</strong>
				</p>
				<p>
					<%= home.byveo.description%>
				</p>
				<a href="http://www.byveo.com" class="button">
					Link
				</a>
			</div>
		</li>
		<li>
			<div class="mentions">
				<div>
					<img src="images/genbeta_logo.png" width="261" height="184"/>
				</div>
				<p>
					<strong>"<%= home.genbeta.quote%>"</strong>
				</p>
				<p>
					<%= home.genbeta.description%>
				</p>
				<a href="http://www.genbetadev.com/desarrollo-web/hydrajs-arquitectura-modular-para-tus-aplicaciones-javascript" class="button">
					Link
				</a>
			</div>
		</li>
	</ul>
</div>