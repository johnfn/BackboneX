# BackboneX

A bunch of small handy tools on top of Backbone.

### MagicView

Backbone.View has been extended into MagicView (better name pending) with the following handy updates:

#### Template attribute (with proper typing):

    template:Template = loadTemplate('whatever');

Set the value of the template and it'll be automatically rendered. No need for initialize/render methods, unless you're doing something fancy.

#### Subviews:

    subviews:SubviewList = {
      '.hero-image': (_attrs) => { return new HeroImageView(_attrs); },
      '.side-panel': (_attrs) => { return new SidePanelView(_attrs); },
      '.footer': (_attrs) => { return new FooterView(_attrs); }
    };

No more boilerplate inside `render` just to add some subviews. Not only that, but subviews track their parents now, so cleaning up views becomes a simple recursive call, rather than a nightmare.

#### Event propagation:

`trigger` an event and it'll propagate all the way up to its parents and grandparents. It'll stop as soon as you `return false` within the event callback. Now you don't have to deal with passing events through multiple views.

### MagicListView

Construct a simple list out of a collection and a subview. Super simple!

    class FriendList extends MagicListView<Backbone.Model> {
      template:Template = F.loadTemplate('friend-list');
      subview(): typeof MagicView { return IndividualFriendView; }
    }
    
    new FriendList({ collection: friendCollection });

### WOW

Doesn't that sound awesome?!? Download it today!
