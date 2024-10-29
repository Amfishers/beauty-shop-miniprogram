<template>
	<view class="rate flex align-end justify-start" @click="clickRate">
		<block><view v-for="item in fulls" :key="item" class="star bg-img star-full" /></block>
		<view v-if="half" class="star bg-img star-half" />
		
		<!-- #ifdef H5 -->
		<block><text v-for="star in nos" :key="star+'_star'"  class="star bg-img star-no" /></block>
		<!-- #endif -->
		
		<!-- #ifdef MP-WEIXIN -->
		<block><text v-for="star in nos" :key="star"  class="star bg-img star-no" /></block>
		<!-- #endif -->
		
		<text v-if="showText" class="text">
			<text>{{ score }}</text>
			分
		</text>
	</view>
</template>

<script>
export default {
	name: 'Rate',
	props: {
		score: {
			type: [String , Number],
			default: 0
			//required: true
		},
		disabled: {
			type: Boolean,
			default: true
		},
		showText: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			fulls: 0,
			half: 0,
			nos: 5,
			curScore: 5
		};
	},
	created: function() {
		this.getStars();
	},
	/**
  mounted() {
	const query = uni.createSelectorQuery().in(this)
	query.select('.rate').boundingClientRect(data => {
		if(data.left) this.position.left = data.left
		if(data.top) this.position.top = data.top
	}).exec()
  },
  */
	methods: {
		getStars(curScore) {
			const score = curScore || this.score;
			if (score > 5 || score < 0) {
				return;
			} else {
				let fs = Math.floor(score);
				let hs = 1;
				const decimal = score - fs;
				if (decimal <= 0.25) {
					hs = 0;
				}
				if (decimal > 0.5) {
					fs++;
					hs = 0;
				}
				this.fulls = fs;
				this.half = hs;
				this.nos = 5 - fs - hs;
				if (!this.disabled) {
					this.$emit('getRateStars', hs / 2 + fs);
				}
			}
		},
		clickRate(e) {
			if (!this.disabled) {
				const rateLeft = e.currentTarget.offsetLeft;
				const targetLeft = e.detail.x;
				const dx = targetLeft - rateLeft;
				this.curScore = dx / 21;
				this.getStars(this.curScore);
			}
		}
	}
};
</script>

<style lang="scss">
.rate {
	.vw {
		display: inline-block;
	}
	.text {
		@include sc(24upx, $mc-greylight);
		margin-left: 10upx;
		font-weight: 400;
		height: 32upx;
		text {
			font-size: 28upx;
			margin-right: 4upx;
		}
	}
	.star {
		width: 32upx;
		height: 32upx;
		display: inline-block;
		margin-right: 10upx;
		&:last-child {
			margin-right: 0;
		}
		&.star-full {
			background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAB10lEQVQ4T5WTzUtUYRTGn/eODjY2TRSmC6OVERT9ERJpSs0i3IpIOJuUoMDFNA013gGhXTs3xsQFQQr6MB2V/ohAiFpFLqwoItEZ556PeO/MNWHuDHhXh3ve8zvPed73GLT5dH4+adNmdna31THTDsBuYdrmY9ncs2MDFDDizn0CBE720SUDaBSkpQIqFkagWAmKBKMdudz74wHcJ2tQDKkIwFzufFwYjgRYqbvF4pkk0EvMfcbRPgNzQaFzSuwoEwyxSI0eCvtf4fOO4/s7B5XK92Sp9Nuo615h8Cpg+sMO9a4EJYYFgOpx/V8Y83YMdCPwQPP5fol3rKjqVVvcXMRBYQiA8EdUaTTheduHJmo+f4pjeCk+XYsCBCrsOMybXTW+bTzvb/BGjhqjU1OdtbOn34Jo6L/UxihWgXA5ET9x0yws+GFd0zVW7997DeZbgeSGB2EM4Tfd3lL6aNNmwMzdH8rUExpnZdcB1gP+eXL51bmWgGomM6AOPjc82DMqri1kn7JK1G1joerF1LuNL5EjVDJ3xsHyXIWXoQcPEotL3+zBX+n0+bjKU2V/TEUnUqvlUiRgf3JimpW3kosvPkS9uj/XBwcNnMup9c3D5Wq7je02Ncz9Azx/NgWZ8Dk6AAAAAElFTkSuQmCC');
		}
		&.star-half {
			background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACA0lEQVQ4T5WTT2gTURDGZ3Yt6xIQq/HPQQURJRAPwnsLK4JF6UEtBaFUWqtYBRWCUGlFG1posBVEtBe99NCL4KG9iRItevQqJo3RKAUpBqkFm5jtmmze7o50JWWDm0AfPB7MzPsx830MQpPzY2oqXGprsyKRiNGoDJsBrAf3hzMn203O+eMNA2h2Vq7mst8yZzrLjLEIIlIQpGEHxr2755RVc2a+qxuIqEPTtOSGAH9G4+/kinUs03N+7d8c5/xUICCRSEjXwuG9oXJ5t1IobBUt8n7JcfZtMs1hch38eLEfENElohEiWpQk6SciLimKshSNRgtoTkxw2TSSKMQOcl0A7zpALnlv9srVQP2IKA8Apz0NiuPjB5TiShKq1qF/ABdqsE/XY0GAedu2O3Rdz6+LWIrHt8urpRdoVY76IZ9vDNQBEPGtEKJL1/XSWqLOhe+Tk2prLvsaLeu414XjQm7wlh8wBwCdnHNRC/5no3H50huslNuByBvjy+24H/Ccc37WH6gDEAAafb0GWpVQTYevo2Pr9Yi4zBjb1RCwfDN2RF3Mf/AERLRcdfPDhaE7JgCMAEDImxnxIGNsIXCElb7eWMvv4hNHVV9Vt7QO7Jye9grT6fQeIcQjAOgmon5N054GAn5d6BlDovfbns28DPIulUqdsG37sH+5mm5js02t5f4C7dHnn3RDH3AAAAAASUVORK5CYII=');
		}
		&.star-no {
			background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABjUlEQVQ4T5WTP0scURTF7xlm2CIo2MQtFtIoDKy4C+8NTBsIaLJIAsE2+AWsLK0tU+ULhLRBUCR/FgTbgfce7IoLC9oELDRNICHFMsMeGdmERWeG3Vc9OPf+eOeedyEVZzgcLuRyGIZ/yspQBbDW7ua61vrD3ACScM4N80alVAiARZDSFxhjXgH4kjeR7ERR9HUugLX2u4hsTJq6WuvNMgAGg8HSaDSqk6yPx+NlAM8AHJD08iYAY5L7JH94nncL4KZWq900m81fMMasicg3AI2qgT7USF6LyMv7GSRJ0vB9P/e7PiPkPMuyThzH1/+HmCTJYhAEhyRfVEEAnKZp+jaO49/39qaLrbWBiJxMDe8hqysiW1rr9J/wKEZr7ZGIvC55xbHW+s209gjgnLsl+bQwMuCnUmq5FOCcWyF5OSn4KyIHk/u+iDyZRLqqlLoqtGCMeQfgo4h8DoJgr9Vq5VFJv99vpGn6XkS2Se5EUfSpEJAvj+/7F+12+6zIQq/Xe55l2dr0clVu4yx/4g5dlI+fXoC35QAAAABJRU5ErkJggg==');
		}
	}
}
</style>
