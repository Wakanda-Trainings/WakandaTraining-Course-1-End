model.Workmate.events.onRestrictingQuery = function () {				var myInfo = sessionStorage.loginInfo;				var resultCollection = ds.Employee.createEntityCollection();				if (myInfo!= null)				{					var session = currentSession();					if (session.belongsTo('Admin'))						resultCollection = ds.Employee.all();					else					{						if (myInfo.myEmployeeID != null)						{							var queryString = '';							if (myInfo.myManagerID != null)							{								// my boss								queryString = 'ID = ' + myInfo.myManagerID + ' OR '; 								// my peers								queryString += '(manager.ID = ' + myInfo.myManagerID;								queryString += ' AND ID != ' + myInfo.myEmployeeID + ') OR ';							}							// and my reports							queryString += ' manager.ID = ' + myInfo.myEmployeeID;							resultCollection = ds.Employee.query(queryString);						} 					}				}				return resultCollection;			};model.Workmate.relation.onGet = function () {				var myInfo = sessionStorage.loginInfo;				var result = '';				if ((myInfo.myManagerID != null ) && (this.ID == myInfo.myManagerID))					result = 'Manager'				else if (this.manager != null)				{					if (this.manager.ID == myInfo.myEmployeeID)						result = 'Report';					else if (this.manager.ID == myInfo.myManagerID)						result = 'Peer';				}				return result;			};model.Workmate.evaluationComments.onGet = function () {				var result = '';				var myInfo = sessionStorage.loginInfo;				if (myInfo != null)				{					var theEval = ds.Evaluation.find('byEmployee.ID = :1 AND aboutEmployee.ID = :2', myInfo.myEmployeeID, this.ID);					if (theEval != null)						result = theEval.comments;				}				return result;			};model.Workmate.evaluationComments.onSet = function (value) {				var myInfo = sessionStorage.loginInfo;				if (myInfo != null)				{					var theEval = ds.Evaluation.find('byEmployee.ID = :1 AND aboutEmployee.ID = :2', myInfo.myEmployeeID, this.ID);					if (theEval == null)						theEval = new ds.Evaluation({aboutEmployee: this, byEmployee: myInfo.myEmployeeID});					theEval.comments = value;					theEval.save();										}			};