Hydra.module.register("single-module", function (oAction)
{
	return {
		isFirstExecution: null,
		init: function()
		{
			var self = this;
			this.isFirstExecution = true;
			this.init = function()
			{
				self.isFirstExecution = false;
			};
		}
	};
});