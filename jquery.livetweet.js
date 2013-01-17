/* 
JQUERY LIVETWEET 0.6
by Sergio Martino
http://twitter.com/sergio_martino
https://github.com/sergiomartino/jQuery-LiveTweet 
*/

(function($){
	var settings = {      
		'limit' : 5,		
		'username' : 'jeresig',
		'timeout' : 10000,
		'template' : '<ul>{tweets}<li>{text}<br>{date}</li>{/tweets}</ul>',	
		'lang' : 'en',
		'relative_dates' : true,
		'format_date' : function(d) {			
			return (this.relative_dates) ? $.fn.livetweet('relative_date',d) : $.fn.livetweet('format_date', d);
		}		
	};
	
	var loc = {
		'en' : {
			'months' : 'JAN,FEB,MAR,APR,MAY,JUN,JUL,AUG,SEP,OCT,NOV,DEC',
			'days' : 'Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday',
			'time_span' : 'seconds ago,about 1 minute ago,minutes ago,about 1 hour ago,hours ago,about 1 day ago,days ago,long time ago',
			'error' : 'An error has occured!',
			'loading' : 'Loading...'
		},
		'id' : {
			'months' : 'JAN,FEB,MAR,APR,MEI,JUN,JUL,AUG,SEP,OKT,NOV,DES',
			'days' : 'Minggu,Senin,Selasa,Rabu,Kamis,Jumat,Sabtu',
			'time_span' : 'detik lalu,sekitar 1 menit lalu,menit lalu,sekitar 1 jam lalu,jam lalu,sekitar 1 hari lalu,hari lalu,sejak lama',
			'error' : 'Kesalahan telah terjadi!',
			'loading' : 'Memuat...'
		},
		'it' : {
			'months' : 'GEN,FEB,MAR,APR,MAG,GIU,LUG,AGO,SET,OTT,NOV,DIC',
			'days' : 'Domenica,Lunedì,Martedì,Mercoledì,Giovedì,Venerdì,Sabato',
			'time_span' : 'secondi fa,circa 1 minuto fa,minuti fa,circa 1 ora fa,ore fa,circa 1 giorno fa,giorni fa,tempo fa',
			'error' : 'Si è verificato un errore!',
			'loading' : 'Caricamento...'
		},
		'fr' : {
			'months' : 'JAN,FEV,MAR,AVR,MAI,JUIN,JUIL,AOUT,SEP,OCT,NOV,DEC',
			'days' : 'Dimanche,Lundi,Mardi,Mercredi,Jeudi,Vendredi,Samedi',
			'time_span' : 'quelques secondes plus tôt,il y a 1 minute,quelques minutes plus tôt,il y a une heure,quelques heures plus tôt,un jour plus tôt,quelques jours plus tôt, il y a un moment',
			'error' : 'Une erreur est apparue!',
			'loading' : 'Chargement...'
		},
		'de' : {
			'months' : 'JAN,FEB,MÄR,APR,MAI,JUN,JUL,AUG,SEP,OKT,NOV,DEZ',
			'days' : 'Sonntag,Montag,Dienstag,Mittwoch,Donnerstag,Freitag,Samstag',
			'time_span' : 'Sekunden alt,ungefähr 1 Minute alt,Minuten alt,ungefähr 1 Stunde alt,Stunden alt,ungefähr 1 Tag alt,Tage alt,vor langer Zeit',
			'error' : 'Ein Fehler ist aufgetreten!',
			'loading' : 'Laden...'
		},
		'pt-br' : {
			'months' : 'JAN,FEV,MAR,ABR,MAI,JUN,JUL,AGO,SET,OUT,NOV,DEZ',
			'days' : 'Domingo,Segunda-feira,Terça-feira,Quarta-feira,Quinta-feira,Sexta-feira,Sábado',
			'time_span' : 'segundos atrás,cerca de 1 minuto atrás,minutos atrás,certa de 1 hora atrás,horas atrás,cerca de 1 dia atrás,dias atrás,Há muito tempo atrás',
			'error' : 'Um erro ocorreu',
			'loading' : 'Carregando...'
		}
	};
	
	var _months, _days, _timespan;
	
	var methods = {
		init : function(options) {
			var $this = this;			
			if(options) $.extend(settings, options);														
			
			_months = loc[settings.lang]['months'].split(',');
			_days = loc[settings.lang]['days'].split(',');
			_timespan = loc[settings.lang]['time_span'].split(',');				
			
			$.ajax({
				beforeSend : function() {$this.html('<span class="livetweet-loading">'+loc[settings.lang]['loading']+'</span>');},
				url : 'http://api.twitter.com/1/statuses/user_timeline.json?include_entities=true&include_rts=1&screen_name='+settings.username+'&count='+settings.limit+'&callback=?',
				type: 'GET',
				dataType: 'jsonp',	
				timeout: settings.timeout,
				error: function() {
					$this.html('<span class="livetweet-error">'+loc[settings.lang]['error']+'</span>');
				},
				success: function(json){																		
					$this.find(".livetweet-loading").remove();
					return $this.each(function() {
						$(this).append($.fn.livetweet('view', json));
					});	
				}
			});							
		
		},
	
		format_links : function(t) {			
			var rxp_url = /((ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?)/gi;
            var rxp_user = /[\@]+([A-Za-z0-9-_]+)/gi;
            var rxp_hash = /[\#]+([A-Za-z0-9-_]+)/gi;

			t = t.replace(rxp_url,'<a target="_blank" href="$1">$1</a>');
			t = t.replace(rxp_user,'<a target="_blank" href="http://twitter.com/$1">@$1</a>');
			t = t.replace(rxp_hash,'<a target="_blank" href="http://search.twitter.com/search?q=&tag=$1&lang=all">#$1</a>');
			
			return t;
		},
		
		format_date : function(dt) {			
			return _days[dt.getDay()]+ ' ' + dt.getDate() + ' ' + _months[dt.getMonth()] + ' ' + dt.getFullYear();		
		},
		
		relative_date : function(dt) {
			diff = ((new Date()).getTime() - dt.getTime())/1000;				
			if(diff < 60) return Math.round(diff) + ' ' + _timespan[0];
			if(diff >= 60 && diff < 120) return _timespan[1];
			if(diff >= 120 && diff < 3600) return Math.floor(diff/60) + ' ' + _timespan[2];
			if(diff >= 3600 && diff < 7200) return _timespan[3];
			if(diff >= 7200 && diff < 86400) return Math.floor(diff/60/60) + ' ' + _timespan[4];
			if(diff >= 86400 && diff < 172800) return _timespan[5];
			if(diff >= 172800 && diff < 2592000) return Math.floor(diff/60/60/24) + ' ' + _timespan[6];
			if(diff >= 2592000) return _timespan[7];
		},	
		
		view : function(json) {
			var p = new RegExp('{tweets}(.*){/tweets}', 'gi');
			var items = p.exec(settings.template);		
			if(items!=null) {
				var view = '';
				for(i=0;i<json.length;i++) {		
					var date_parse = $.browser.msie ? new Date(json[i].created_at.replace(/(\+\S+) (.*)/, '$2 $1')) : new Date(json[i].created_at);						
					var item = items[1].replace(/{text}/g, $.fn.livetweet('format_links', json[i].text));					
					item = item.replace(/{date}/g, settings.format_date(date_parse));
					view += item;
				}
				return settings.template.replace(p, view);
			}
			return '';
		}
	};

	$.fn.livetweet = function(method) {
		if(methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments,1));
		} else if(typeof method === 'object' || !method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error('Method '+method+' does not exist on jQuery.livetweet');
		}    
	};
})($);
